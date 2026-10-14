import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const escapeHtml = (text = '') => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all fields.',
    });
  }

  // Limit input size
  if (
    name.length > 100 ||
    email.length > 150 ||
    subject.length > 150 ||
    message.length > 2000
  ) {
    return res.status(400).json({
      success: false,
      error: 'One or more fields are too long.',
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid email address.',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Escape user input before putting it into HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    const mailOptions = {
      from: `"GITF Website" <${process.env.EMAIL_USER}>`,

      to: process.env.RECEIVER_EMAIL,

      replyTo: email,

      subject: `New Website Inquiry: ${safeSubject}`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">

          <h2 style="color: #7E5CAD;">
            New Contact Form Submission
          </h2>

          <p>
            <strong>Name:</strong> ${safeName}
          </p>

          <p>
            <strong>Email:</strong> ${safeEmail}
          </p>

          <p>
            <strong>Subject:</strong> ${safeSubject}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div style="
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #66BB6A;
            white-space: pre-wrap;
          ">
            ${safeMessage}
          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully!',
    });

  } catch (error) {
    console.error('Email Error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again later.',
    });
  }
};