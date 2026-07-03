import transporter from '../config/email.js';
import dotenv from 'dotenv';

dotenv.config();

// Email templates
const emailTemplates = {
  lectureAssigned: (data) => ({
    subject: 'New Lecture Assigned',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .details { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
            .detail-item { margin: 8px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .badge { display: inline-block; padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 20px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📚 New Lecture Assigned</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Dear ${data.instructorName},</p>
              <p>You have been assigned to teach a new lecture. Please find the details below:</p>
              <div class="details">
                <div class="detail-item"><strong>📖 Batch:</strong> ${data.batchName}</div>
                <div class="detail-item"><strong>📚 Course:</strong> ${data.courseName}</div>
                <div class="detail-item"><strong>📅 Date:</strong> ${data.lectureDate}</div>
                <div class="detail-item"><strong>⏰ Time:</strong> ${data.startTime} - ${data.endTime}</div>
                <div class="detail-item"><strong>🏫 Room:</strong> ${data.roomNumber}</div>
                ${data.meetingLink ? `<div class="detail-item"><strong>🔗 Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></div>` : ''}
              </div>
              <div style="text-align: center; margin: 25px 0;">
                <span class="badge">${data.status || 'Upcoming'}</span>
              </div>
              <p style="color: #64748b; font-size: 14px;">Please contact the admin if you have any questions or need to reschedule.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="color: #64748b; font-size: 14px;">This is an automated message from College Lecture Scheduler.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} College Lecture Scheduler. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  lectureUpdated: (data) => ({
    subject: 'Lecture Updated',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .detail-item { margin: 8px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
            .badge { display: inline-block; padding: 4px 12px; background: #fef3c7; color: #92400e; border-radius: 20px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✏️ Lecture Updated</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Dear ${data.instructorName},</p>
              <p>The following lecture has been updated. Please review the changes:</p>
              <div class="details">
                <div class="detail-item"><strong>📖 Batch:</strong> ${data.batchName}</div>
                <div class="detail-item"><strong>📚 Course:</strong> ${data.courseName}</div>
                <div class="detail-item"><strong>📅 Date:</strong> ${data.lectureDate}</div>
                <div class="detail-item"><strong>⏰ Time:</strong> ${data.startTime} - ${data.endTime}</div>
                <div class="detail-item"><strong>🏫 Room:</strong> ${data.roomNumber}</div>
                ${data.meetingLink ? `<div class="detail-item"><strong>🔗 Meeting Link:</strong> <a href="${data.meetingLink}">${data.meetingLink}</a></div>` : ''}
              </div>
              <div style="text-align: center; margin: 25px 0;">
                <span class="badge">${data.status || 'Updated'}</span>
              </div>
              <p style="color: #64748b; font-size: 14px;">Please review the updated details and contact the admin if you have any questions.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="color: #64748b; font-size: 14px;">This is an automated message from College Lecture Scheduler.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} College Lecture Scheduler. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  lectureCancelled: (data) => ({
    subject: 'Lecture Cancelled',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .details { background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
            .detail-item { margin: 8px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
            .badge { display: inline-block; padding: 4px 12px; background: #fee2e2; color: #991b1b; border-radius: 20px; font-size: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">❌ Lecture Cancelled</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Dear ${data.instructorName},</p>
              <p>The following lecture has been cancelled:</p>
              <div class="details">
                <div class="detail-item"><strong>📖 Batch:</strong> ${data.batchName}</div>
                <div class="detail-item"><strong>📚 Course:</strong> ${data.courseName}</div>
                <div class="detail-item"><strong>📅 Date:</strong> ${data.lectureDate}</div>
                <div class="detail-item"><strong>⏰ Time:</strong> ${data.startTime} - ${data.endTime}</div>
              </div>
              <div style="text-align: center; margin: 25px 0;">
                <span class="badge">Cancelled</span>
              </div>
              <p style="color: #64748b; font-size: 14px;">Please contact the admin if you have any questions or need further information.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="color: #64748b; font-size: 14px;">This is an automated message from College Lecture Scheduler.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} College Lecture Scheduler. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px; }
            .header { background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .button { display: inline-block; padding: 14px 35px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .warning { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 10px;">Hello ${data.name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Reset Password</a>
              </div>
              <div class="warning">
                <strong>⚠️ This link will expire in 10 minutes.</strong>
              </div>
              <p style="color: #64748b; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="color: #64748b; font-size: 14px;">This is an automated message from College Lecture Scheduler.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} College Lecture Scheduler. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
};

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Send lecture assigned email
export const sendLectureAssignedEmail = async (data) => {
  const template = emailTemplates.lectureAssigned(data);
  return await sendEmail(data.instructorEmail, template.subject, template.html);
};

// Send lecture updated email
export const sendLectureUpdatedEmail = async (data) => {
  const template = emailTemplates.lectureUpdated(data);
  return await sendEmail(data.instructorEmail, template.subject, template.html);
};

// Send lecture cancelled email
export const sendLectureCancelledEmail = async (data) => {
  const template = emailTemplates.lectureCancelled(data);
  return await sendEmail(data.instructorEmail, template.subject, template.html);
};

// Send password reset email
export const sendPasswordResetEmail = async (data) => {
  const template = emailTemplates.passwordReset(data);
  return await sendEmail(data.email, template.subject, template.html);
};

export default {
  sendEmail,
  sendLectureAssignedEmail,
  sendLectureUpdatedEmail,
  sendLectureCancelledEmail,
  sendPasswordResetEmail
};