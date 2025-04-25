import nodeMailer from 'nodemailer';
import userModel from '../models/usermodel.js';
import bcrypt from 'bcrypt';

const transporter = nodeMailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'harshvirani1470@gmail.com',
        pass:'gapbwhyhchxjrvss'
    }
});

const otpStorage = new Map();

const sendMail = async (req, res) => {
    const { email } = req.body;
    // console.log('Email received:', email);  // Debugging log

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }
    const response = await
    userModel.findOne({ email: email });
    if (!response) {
        return res.json({ success: false, message: "Email not found" });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const msg = `<h1>Reset Password</h1><p>OTP: ${otp}</p>`;
        const msg2 = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your One-Time Password (OTP)</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007BFF;
                    margin: 20px 0;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Your One-Time Password (OTP) for Secure Access</h2>
                <p>Dear ${email},</p>
                <p>We hope this message finds you well.</p>
                <p>To ensure the security of your account, we have generated a One-Time Password (OTP) for your recent request. Please use the following OTP to proceed:</p>
                <div class="otp">OTP: <strong>${otp}</strong></div>
                <p>This OTP is valid for <strong>10 Mimnutes</strong> and will expire after this period. Please do not share this OTP with anyone for your account's safety.</p>
                <p>If you did not request this OTP, please contact our support team immediately at <a href="mailto:sdpprojectbca@gmail.com">sdpprojectbca@gmail.com</a> or call us at 9876543210.</p>
                <p>Thank you for choosing "Online Food Delivery and Dining Reservation". We are committed to keeping your information secure.</p>
                <div class="footer">
                    Best regards,<br>
                    "OFDADR"<br>
                </div>
            </div>
        </body>
        </html>`;
        
        await transporter.sendMail({
            from: 'harshvirani1470@gmail.com', // Add 'from' field
            to: email, // Make sure email is received correctly
            subject: "Reset Password OTP",
            html: msg2
        });
        otpStorage.set(email, otp);

        // Set a timeout to clear the OTP after 5 minutes (300,000 milliseconds)
        setTimeout(() => {
            otpStorage.delete(email);
        }, 300000);
        // console.log('Mail Sent Successfully');
        res.json({ success: true, otp: otp });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ success: false, message: "Can't send mail" });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    // Retrieve the stored OTP for the user's email
    const storedOtp = otpStorage.get(email);

    if (!storedOtp) {
        return res.json({ success: false, message: "OTP expired or not found" });
    }

    if (parseInt(otp) === storedOtp) {
        // Clear the OTP after successful verification
        otpStorage.delete(email);
        return res.json({ success: true, message: "OTP verified successfully" });
    } else {
        return res.json({ success: false, message: "Invalid OTP" });
    }
};


    // try {
    //     response.password = password;
    //     await response.save();
    //     return res.json({ success: true, message: "Password reset successfully" });
    // } catch (error) {
    //     console.error('Error resetting password:', error);
    //     return res.json({ success: false, message: "Can't reset password" });
    // }



export {sendMail,verifyOtp};
// sendMail('harshvi1447@gmail.com','Reset Password OTP','<h1>Reset Password</h1><p>Otp: 626000</p>');