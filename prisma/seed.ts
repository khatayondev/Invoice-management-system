import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete all data (cascading takes care of relations)
  await prisma.company.deleteMany();

  console.log('Seeding demo data...');

  // 1. Create Company
  const company = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
      address: '123 Business Avenue\nSuite 100\nMetropolis, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'billing@acmecorp.com',
      website: 'www.acmecorp.com',
      taxId: 'US-987654321',
      defaultCurrency: 'USD',
      defaultTaxRate: 8.5,
      invoicePrefix: 'INV-',
      invoiceStartNumber: 1001,
      paymentInstructions: 'Please make checks payable to Acme Corporation.\nBank Transfer: Routing: 122000248 Account: 123456789',
      defaultTerms: 'Payment is due within 15 days of invoice date. Late payments are subject to a 1.5% monthly fee.'
    }
  });

  // 2. Create User
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      companyId: company.id,
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // 3. Create Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        companyId: company.id,
        name: 'John Smith',
        clientCompany: 'TechFlow Solutions',
        email: 'john@techflow.io',
        phone: '555-0100',
        billingAddress: '456 Tech Park\nBuilding B\nSan Francisco, CA 94105'
      }
    }),
    prisma.client.create({
      data: {
        companyId: company.id,
        name: 'Sarah Connor',
        clientCompany: 'Cyberdyne Systems',
        email: 'sarah.c@cyberdyne.com',
        phone: '555-0200',
        billingAddress: '1 Skynet Way\nLos Angeles, CA 90001'
      }
    }),
    prisma.client.create({
      data: {
        companyId: company.id,
        name: 'Bruce Wayne',
        clientCompany: 'Wayne Enterprises',
        email: 'bruce@wayne.com',
        phone: '555-0300',
        billingAddress: '1007 Mountain Drive\nGotham City, NJ 07001'
      }
    })
  ]);

  // 4. Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        companyId: company.id,
        name: 'Web Development',
        description: 'Frontend and backend development services',
        defaultPrice: 150.00,
        unit: 'Hour'
      }
    }),
    prisma.product.create({
      data: {
        companyId: company.id,
        name: 'UI/UX Design',
        description: 'User interface design and prototyping',
        defaultPrice: 120.00,
        unit: 'Hour'
      }
    }),
    prisma.product.create({
      data: {
        companyId: company.id,
        name: 'Monthly Hosting',
        description: 'Premium cloud hosting and maintenance',
        defaultPrice: 499.00,
        unit: 'Item'
      }
    })
  ]);

  // 5. Create Invoices
  const now = new Date();
  
  // Paid Invoice
  const inv1 = await prisma.invoice.create({
    data: {
      companyId: company.id,
      clientId: clients[0].id,
      number: 'INV-1001',
      status: 'PAID',
      issueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      dueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      currency: 'USD',
      subtotal: 1500,
      taxTotal: 127.5,
      grandTotal: 1627.5,
      paymentInstructions: company.paymentInstructions,
      terms: company.defaultTerms,
      lineItems: {
        create: [
          { productId: products[0].id, description: products[0].name, quantity: 10, unitPrice: 150, lineTotal: 1500, sortOrder: 0 }
        ]
      }
    }
  });

  // Add payment for inv1
  await prisma.payment.create({
    data: {
      invoiceId: inv1.id,
      amount: 1627.5,
      date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      method: 'BANK_TRANSFER',
      referenceNumber: 'TXN-998877'
    }
  });

  // Overdue Invoice
  await prisma.invoice.create({
    data: {
      companyId: company.id,
      clientId: clients[1].id,
      number: 'INV-1002',
      status: 'OVERDUE',
      issueDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      currency: 'USD',
      subtotal: 2400,
      taxTotal: 204,
      grandTotal: 2604,
      paymentInstructions: company.paymentInstructions,
      terms: company.defaultTerms,
      lineItems: {
        create: [
          { productId: products[1].id, description: products[1].name, quantity: 20, unitPrice: 120, lineTotal: 2400, sortOrder: 0 }
        ]
      }
    }
  });

  // Draft Invoice
  await prisma.invoice.create({
    data: {
      companyId: company.id,
      clientId: clients[2].id,
      number: 'INV-1003',
      status: 'DRAFT',
      issueDate: now,
      dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      currency: 'USD',
      subtotal: 499,
      taxTotal: 42.41,
      grandTotal: 541.41,
      paymentInstructions: company.paymentInstructions,
      terms: company.defaultTerms,
      lineItems: {
        create: [
          { productId: products[2].id, description: products[2].name, quantity: 1, unitPrice: 499, lineTotal: 499, sortOrder: 0 }
        ]
      }
    }
  });

  console.log('Seeding completed successfully!');
  console.log('Login with: demo@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
