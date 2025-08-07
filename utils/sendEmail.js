import nodemailer from 'nodemailer';

export const sendBookingConfirmation = async (toEmail, { turfName, venueName, date, slot }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Turf Booking" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Booking Confirmation',
    html: `
      <h3>Booking Confirmed 🎉</h3>
      <p><strong>Turf:</strong> ${turfName}</p>
      <p><strong>Venue:</strong> ${venueName}</p>
      <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
      <p><strong>Slot:</strong> ${slot}</p>
      <br/>
      <p>Thank you for booking with us!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
