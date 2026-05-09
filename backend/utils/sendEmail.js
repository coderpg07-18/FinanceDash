
// sendEmail.js - Nodemailer

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App-Pass
  },
});

module.exports.sendPasswordResetEmail = async (email, resetToken) => {
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await transporter.sendMail({
    from: `"FinanceDash" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request - FinanceDash",
    html: `
      <div style="
      font-family:Arial,sans-serif;
      max-width:500px;
      margin:auto;
      padding:2rem;
      background:#1e293b;
      color:#f1f5f9;
      border-radius:12px;
      ">
        
        <h2 style="color:#6366f1;">FinanceDash</h2>
        <h3>Password Reset Request</h3>
        
        <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
        
        <a 
        href="${resetURL}" 
        style="
        display:inline-block;
        background:#6366f1;
        color:white;
        padding:12px 24px;
        border-radius:8px;
        text-decoration:none;
        margin:1rem 0;
        ">
        Reset Password
        </a>
        
        <p style="color:#94a3b8;font-size:0.85rem;">If you didn't request this, ignore this email.</p>
      
        </div>
    `,
  });
};

module.exports.sendBudgetWarningEmail = async (email, category, percentage) => {
  await transporter.sendMail({
    from: `"FinanceDash" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Budget Warning: ${category} at ${percentage}%`,
    html: `
      <div style="
      font-family:Arial,sans-serif;
      max-width:500px;
      margin:auto;
      padding:2rem;
      background:#1e293b;
      color:#f1f5f9;
      border-radius:12px;
      ">
        <h2 style="color:#6366f1;">FinanceDash</h2>
        <h3 style="color:#eab308;">Budget Warning</h3>
        
        <p>Your <strong>${category}</strong> budget is at <strong style="color:#ef4444;">${percentage}%</strong> usage.</p>
        
        <p>Consider reviewing your spending to stay within budget.</p>
        
        <a 
        href="${process.env.CLIENT_URL}/budget" 
        style="
        display:inline-block;
        background:#6366f1;
        color:white;
        padding:12px 24px;
        border-radius:8px;
        text-decoration:none;
        ">
        View Budget
        </a>
      </div>
    `,
  });
};
