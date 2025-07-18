const nodemailer = require('nodemailer');
require('dotenv').config();

// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "39a12a6210d430",
    pass: "1692316a0fe12f"
  }
});
async function sendOTP(email, otp) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
}

module.exports = sendOTP;
