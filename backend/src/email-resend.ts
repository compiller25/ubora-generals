// Alternative: Resend.com (more reliable for production)
// bun add resend

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailResend(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: 'Ubora Generals <orders@your-domain.com>',
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
}

// Add to .env:
// RESEND_API_KEY=your_resend_api_key
