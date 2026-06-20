import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password, not regular password
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log(`Attempting to send email to: ${to}`);
    console.log(`Email configured: ${!!process.env.EMAIL_USER}`);
    
    await transporter.sendMail({
      from: `"Ubora Generals" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}: ${subject}`);
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw error;
  }
}

export function getOrderConfirmationEmail(order: any) {
  return `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order! Here are the details:</p>
    
    <h3>Order #${order._id.toString().slice(-8)}</h3>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Total:</strong> TZS ${order.totalPrice.toLocaleString()}</p>
    
    <h4>Items:</h4>
    <ul>
      ${order.items.map((item: any) => 
        `<li>${item.packageName} x${item.quantity} - TZS ${item.subtotal.toLocaleString()}</li>`
      ).join('')}
    </ul>
    
    <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    
    <p>We'll notify you when your order ships!</p>
  `;
}

export function getPasswordResetEmail(code: string) {
  return `
    <h2>Password Reset</h2>
    <p>Your password reset code is:</p>
    <h1 style="color: #007bff; font-size: 32px; letter-spacing: 4px;">${code}</h1>
    <p>This code expires in 10 minutes.</p>
    <p>If you didn't request this, ignore this email.</p>
  `;
}
