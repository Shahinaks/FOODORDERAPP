import nodemailer from 'nodemailer';

export const sendOrderConfirmation = async (toEmail, orderId, status = 'Preparing') => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const getStepColor = (step) => {
      const steps = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
      const index = steps.indexOf(step);
      return steps.map((s, i) => i <= index ? '#10b981' : '#e5e7eb');
    };

    const [placedColor, preparingColor, outColor, deliveredColor] = getStepColor(status);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: 'Order Confirmation - Your Food is on the Way!',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; padding: 24px; background: #f9fafb;">
          <h2 style="color: #10b981;">✅ Order Placed Successfully!</h2>
          <p>Hi there,</p>
          <p>Your order has been placed. Here are the details:</p>

          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Status:</strong> ${status}</p>

          <div style="margin: 32px 0;">
            <p style="font-size: 16px; margin-bottom: 12px;">🕓 Order Status Tracker</p>
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <div style="text-align: center; flex: 1;">
                <div style="width: 24px; height: 24px; margin: 0 auto 6px; background: ${placedColor}; border-radius: 50%;"></div>
                <div>Placed</div>
              </div>
              <div style="flex: 1; border-top: 2px solid ${preparingColor}; margin-top: 11px;"></div>
              <div style="text-align: center; flex: 1;">
                <div style="width: 24px; height: 24px; margin: 0 auto 6px; background: ${preparingColor}; border-radius: 50%;"></div>
                <div>Preparing</div>
              </div>
              <div style="flex: 1; border-top: 2px solid ${outColor}; margin-top: 11px;"></div>
              <div style="text-align: center; flex: 1;">
                <div style="width: 24px; height: 24px; margin: 0 auto 6px; background: ${outColor}; border-radius: 50%;"></div>
                <div>Out for Delivery</div>
              </div>
              <div style="flex: 1; border-top: 2px solid ${deliveredColor}; margin-top: 11px;"></div>
              <div style="text-align: center; flex: 1;">
                <div style="width: 24px; height: 24px; margin: 0 auto 6px; background: ${deliveredColor}; border-radius: 50%;"></div>
                <div>Delivered</div>
              </div>
            </div>
          </div>

          <p>We’ll notify you when your food is on the move. 🚀</p>
          <p style="margin-top: 40px;">Thanks for ordering with us!<br/><strong>Foodie Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation sent to ${toEmail}`);
  } catch (err) {
    console.error('❌ Failed to send order confirmation email:', err);
  }
};
