
import nodemailer from 'nodemailer';
import config from '../config/temp.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASSWORD   // gmail app password
    }
});

export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `http://localhost:3000/api/auth/verify-email/${token}`;

    await transporter.sendMail({
        from: config.EMAIL,
        to: email,
        subject: 'Verify your email',
        html: `
            <h2>Email Verification</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>This link expires in 24 hours.</p>
        `
    });
};