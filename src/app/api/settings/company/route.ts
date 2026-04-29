import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Mask sensitive fields
    if (company.smtpPass) {
      company.smtpPass = '********';
    }
    if (company.stripeSecretKey) {
      company.stripeSecretKey = '********';
    }
    if (company.stripeWebhookSecret) {
      company.stripeWebhookSecret = '********';
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();

    // If sensitive fields are masked, don't update them
    if (body.smtpPass === '********') delete body.smtpPass;
    if (body.stripeSecretKey === '********') delete body.stripeSecretKey;
    if (body.stripeWebhookSecret === '********') delete body.stripeWebhookSecret;

    const updatedCompany = await prisma.company.update({
      where: { id: session.user.companyId },
      data: {
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        website: body.website,
        taxId: body.taxId,
        defaultCurrency: body.defaultCurrency,
        defaultTaxRate: body.defaultTaxRate,
        invoicePrefix: body.invoicePrefix,
        invoiceStartNumber: body.invoiceStartNumber,
        quotePrefix: body.quotePrefix,
        quoteStartNumber: body.quoteStartNumber,
        defaultTerms: body.defaultTerms,
        defaultNotes: body.defaultNotes,
        paymentInstructions: body.paymentInstructions,
        smtpHost: body.smtpHost,
        smtpPort: body.smtpPort,
        smtpUser: body.smtpUser,
        ...(body.smtpPass ? { smtpPass: body.smtpPass } : {}),
        smtpFromName: body.smtpFromName,
        smtpFromEmail: body.smtpFromEmail,
        ...(body.stripeSecretKey ? { stripeSecretKey: body.stripeSecretKey } : {}),
        ...(body.stripeWebhookSecret ? { stripeWebhookSecret: body.stripeWebhookSecret } : {}),
      },
    });

    return NextResponse.json({ success: true, company: updatedCompany });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
