import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendEmail } from '@/lib/email/send-email';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId,
        deletedAt: null
      },
      include: {
        client: true,
        company: true
      }
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.company.smtpHost || !invoice.company.smtpUser) {
      return NextResponse.json({ error: 'SMTP settings not configured. Please configure them in Settings.' }, { status: 400 });
    }

    if (!invoice.client.email) {
      return NextResponse.json({ error: 'Client does not have an email address.' }, { status: 400 });
    }

    const subject = `Invoice ${invoice.number} from ${invoice.company.name}`;
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F4F7FE; padding: 40px 20px; margin: 0;">
        <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.02);">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background-color: #4318FF; color: #ffffff; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; font-weight: bold; font-size: 24px; margin-bottom: 10px;">
              ${invoice.company.name.charAt(0)}
            </div>
            <h2 style="color: #111827; font-size: 24px; margin: 0 0 5px 0;">New Invoice from ${invoice.company.name}</h2>
            <p style="color: #6B7280; font-size: 14px; margin: 0;">Invoice #${invoice.number}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-top: 0;">Hi ${invoice.client.name},</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">I hope you're doing well. Please see the details of your new invoice below.</p>
          </div>
          
          <div style="background-color: #F9FAFB; border-radius: 16px; padding: 24px; margin-bottom: 30px; text-align: center;">
            <p style="color: #6B7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Amount Due</p>
            <p style="color: #111827; font-size: 36px; font-weight: bold; margin: 0 0 10px 0;">${invoice.currency} ${invoice.grandTotal.toFixed(2)}</p>
            <p style="color: #6B7280; font-size: 14px; margin: 0;">Due by: <strong>${new Date(invoice.dueDate).toLocaleDateString()}</strong></p>
          </div>

          <div style="text-align: center; margin-bottom: 40px;">
            <p style="color: #6B7280; font-size: 14px; margin-bottom: 20px;">You can view and securely download the PDF version of your invoice below.</p>
            <a href="#" style="display: inline-block; background-color: #4318FF; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(67, 24, 255, 0.2);">
              View Full Invoice
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin-bottom: 20px;" />
          
          <div style="text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">Thank you for your business!</p>
            <p style="color: #9CA3AF; font-size: 12px; margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} ${invoice.company.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: invoice.client.email,
        subject,
        html,
        smtpSettings: {
          host: invoice.company.smtpHost,
          port: invoice.company.smtpPort,
          user: invoice.company.smtpUser,
          pass: invoice.company.smtpPass,
          fromName: invoice.company.smtpFromName,
          fromEmail: invoice.company.smtpFromEmail,
        }
      });

      // Log the email
      await prisma.emailLog.create({
        data: {
          invoiceId: invoice.id,
          recipientEmail: invoice.client.email,
          subject,
          status: 'SENT'
        }
      });

      // Update invoice status to SENT if it was DRAFT
      if (invoice.status === 'DRAFT') {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { status: 'SENT' }
        });
      }

      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (emailError: any) {
      console.error('SMTP Error:', emailError);
      
      await prisma.emailLog.create({
        data: {
          invoiceId: invoice.id,
          recipientEmail: invoice.client.email,
          subject,
          status: 'FAILED',
          errorMessage: emailError.message
        }
      });

      return NextResponse.json({ error: `Failed to send email: ${emailError.message}` }, { status: 500 });
    }

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
