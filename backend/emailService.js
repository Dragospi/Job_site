const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using the pre-configured transporter.
 *
 * @param {Object} mailOptions - The mail options object.
 * @param {string} mailOptions.from - The sender's email address.
 * @param {string} mailOptions.to - The recipient's email address.
 * @param {string} mailOptions.subject - The subject of the email.
 * @param {string} mailOptions.html - The HTML body of the email.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

module.exports = { sendEmail };