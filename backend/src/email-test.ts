// Simple email service using Ethereal (for testing)
import nodemailer from 'nodemailer';

// Create test account (for development only)
export async function createTestEmailService() {
  const testAccount = await nodemailer.createTestAccount();
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return {
    async sendEmail(to: string, subject: string, html: string) {
      const info = await transporter.sendMail({
        from: '"Ubora Generals" <test@example.com>',
        to,
        subject,
        html,
      });

      console.log(`✅ Test email sent: ${nodemailer.getTestMessageUrl(info)}`);
      return info;
    }
  };
}
