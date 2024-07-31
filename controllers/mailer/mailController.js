// mailController.js

const transporter = require('./mailTransporter');

const studentModel = require('../../models/studentModel');

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Function to send application confirmation email
async function sendApplicationConfirmationEmail(recipientEmail, driveDetails) {
    try {
        // Construct email message
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: recipientEmail,
            subject: 'Application Confirmation',
            text: `Hello,\n\nThank you for applying for the ${driveDetails.company_name} drive.\n\nBest regards,\nPlacement Team`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        //console.log('Application confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending application confirmation email:', error);
    }
}



// Function to send emails to students for a new drive announcement
const sendDriveAnnouncementEmail = async (driveId, driveDetails) => {
  try {
    // Get student emails for the specified drive
    const studentEmails = await studentModel.getStudentEmailsForDrive(driveId);

    // If no student emails found, return early
    if (studentEmails.length === 0) {
      console.log('No students found for the drive');
      return;
    }

    // Construct email options
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: studentEmails.join(', '), // Comma-separated list of student emails
      subject: 'New Drive Announcement',
      html: `
        <p>Dear Student,</p>
        <p>A new drive has been announced:</p>
        <p>Drive Name: ${driveDetails.company_name}</p>
        <p>Date: ${new Date(driveDetails.date_of_drive).toLocaleDateString()}</p>
        <p>Job Role: ${driveDetails.job_role}</p>
        <p>Job Description: ${driveDetails.job_description}</p>
        <p>For more details, visit our portal.</p>
        <p>Best regards,</p>
        <p>Placement Team</p>
      `
    };

    // Send emails
    await transporter.sendMail(mailOptions);
    console.log('New Drive Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}


module.exports = {
    sendApplicationConfirmationEmail, sendDriveAnnouncementEmail
};
