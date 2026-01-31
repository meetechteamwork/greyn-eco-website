// Email transporter configuration
let transporter = null;
let nodemailer = null;
let emailEnabled = false;

// Try to load nodemailer, but don't fail if it's not installed
try {
  nodemailer = require('nodemailer');
  emailEnabled = true;
} catch (error) {
  console.warn('⚠️  nodemailer not installed. Email functionality will be disabled.');
  console.warn('   To enable emails, run: npm install nodemailer');
  emailEnabled = false;
}

/**
 * Initialize email transporter
 */
const initEmailTransporter = () => {
  if (!emailEnabled || !nodemailer) {
    return null;
  }

  if (transporter) return transporter;

  // Use environment variables for email configuration
  // For development, can use Gmail, SendGrid, Mailgun, or any SMTP service
  const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD,
    },
  };

  // If no email credentials, return null (emails will be skipped)
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('⚠️  Email credentials not configured. Emails will not be sent.');
    console.warn('   Configure SMTP_USER and SMTP_PASS in .env to enable email sending.');
    return null;
  }

  try {
    transporter = nodemailer.createTransport(emailConfig);
    return transporter;
  } catch (error) {
    console.error('❌ Error creating email transporter:', error.message);
    return null;
  }
};

/**
 * Verify email transporter connection
 */
const verifyEmailConnection = async () => {
  if (!emailEnabled || !nodemailer) {
    return false;
  }

  try {
    const emailTransporter = initEmailTransporter();
    if (!emailTransporter) {
      return false;
    }
    await emailTransporter.verify();
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return false;
  }
};

/**
 * Send invitation email
 */
const sendInvitationEmail = async (invitationData) => {
  // Check if email is enabled
  if (!emailEnabled || !nodemailer) {
    console.warn('⚠️  Email sending is disabled. Invitation created but email not sent.');
    console.warn('   Install nodemailer and configure SMTP to enable email sending.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const emailTransporter = initEmailTransporter();
    
    if (!emailTransporter) {
      console.warn('⚠️  Email transporter not configured. Invitation created but email not sent.');
      return { success: false, message: 'Email transporter not configured' };
    }
    
    const platformUrl = process.env.FRONTEND_URL || process.env.PLATFORM_URL || 'http://localhost:3000';
    const invitationLink = `${platformUrl}/accept-invitation?token=${invitationData.token}`;
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Greyn Eco Platform'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: invitationData.email,
      subject: `Invitation to Join ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #dc2626;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #b91c1c;
            }
            .details {
              background-color: #f9fafb;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .details-row {
              margin: 8px 0;
            }
            .label {
              font-weight: bold;
              color: #6b7280;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
            .expiry {
              color: #dc2626;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}</div>
            </div>
            
            <div class="content">
              <h2>You've been invited!</h2>
              <p>You have been invited to join the <strong>${invitationData.portal}</strong> portal as a <strong>${invitationData.role.charAt(0).toUpperCase() + invitationData.role.slice(1)}</strong>.</p>
              
              <div class="details">
                <div class="details-row">
                  <span class="label">Invitation Code:</span> ${invitationData.invitationCode}
                </div>
                <div class="details-row">
                  <span class="label">Role:</span> ${invitationData.role.charAt(0).toUpperCase() + invitationData.role.slice(1)}
                </div>
                <div class="details-row">
                  <span class="label">Portal:</span> ${invitationData.portal}
                </div>
                <div class="details-row">
                  <span class="label">Expires:</span> <span class="expiry">${new Date(invitationData.expiresAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${invitationLink}" class="button">Accept Invitation</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6b7280; font-size: 12px;">${invitationLink}</p>
              
              <p><strong>Note:</strong> This invitation link will expire on ${new Date(invitationData.expiresAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
              })}. Please accept it before then.</p>
            </div>
            
            <div class="footer">
              <p>This is an automated email from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}. Please do not reply to this email.</p>
              <p>If you did not expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
You've been invited to join ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}!

You have been invited to join the ${invitationData.portal} portal as a ${invitationData.role.charAt(0).toUpperCase() + invitationData.role.slice(1)}.

Invitation Details:
- Invitation Code: ${invitationData.invitationCode}
- Role: ${invitationData.role.charAt(0).toUpperCase() + invitationData.role.slice(1)}
- Portal: ${invitationData.portal}
- Expires: ${new Date(invitationData.expiresAt).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Accept your invitation by clicking the link below:
${invitationLink}

Or copy and paste this link into your browser:
${invitationLink}

Note: This invitation will expire on ${new Date(invitationData.expiresAt).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric'
})}. Please accept it before then.

This is an automated email from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}. Please do not reply to this email.
If you did not expect this invitation, you can safely ignore this email.
      `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Invitation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending invitation email:', error.message || error);
    // Don't throw error - return failure instead
    return { success: false, message: error.message || 'Failed to send email' };
  }
};

/**
 * Send support email to support team
 */
const sendSupportEmail = async (supportData) => {
  if (!emailEnabled || !nodemailer) {
    console.warn('⚠️  Email sending is disabled. Support request created but email not sent.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const emailTransporter = initEmailTransporter();
    
    if (!emailTransporter) {
      console.warn('⚠️  Email transporter not configured. Support request created but email not sent.');
      return { success: false, message: 'Email transporter not configured' };
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Greyn Eco Platform'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: supportData.to,
      replyTo: supportData.from,
      subject: supportData.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              margin: -30px -30px 30px -30px;
            }
            .content {
              margin-bottom: 30px;
            }
            .details {
              background-color: #f9fafb;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              border-left: 4px solid #10b981;
            }
            .details-row {
              margin: 8px 0;
            }
            .label {
              font-weight: bold;
              color: #6b7280;
            }
            .message-box {
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              white-space: pre-wrap;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Support Request</h2>
            </div>
            
            <div class="content">
              <p>A new support request has been submitted from the Corporate Portal.</p>
              
              <div class="details">
                <div class="details-row">
                  <span class="label">From:</span> ${supportData.fromName} (${supportData.from})
                </div>
                <div class="details-row">
                  <span class="label">Company:</span> ${supportData.companyName}
                </div>
                <div class="details-row">
                  <span class="label">Subject:</span> ${supportData.subject}
                </div>
                <div class="details-row">
                  <span class="label">Contact ID:</span> ${supportData.contactId}
                </div>
                <div class="details-row">
                  <span class="label">Date:</span> ${new Date().toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <h3>Message:</h3>
              <div class="message-box">
                ${supportData.message.replace(/\n/g, '<br>')}
              </div>
              
              <p><strong>Please respond to this request within 24 hours.</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated email from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}.</p>
              <p>You can reply directly to this email to respond to ${supportData.fromName}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Support Request

A new support request has been submitted from the Corporate Portal.

From: ${supportData.fromName} (${supportData.from})
Company: ${supportData.companyName}
Subject: ${supportData.subject}
Contact ID: ${supportData.contactId}
Date: ${new Date().toLocaleString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Message:
${supportData.message}

Please respond to this request within 24 hours.

This is an automated email from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}.
You can reply directly to this email to respond to ${supportData.fromName}.
      `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Support email sent to support team:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending support email:', error.message || error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
};

/**
 * Send confirmation email to corporate user
 */
const sendSupportConfirmationEmail = async (confirmationData) => {
  if (!emailEnabled || !nodemailer) {
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const emailTransporter = initEmailTransporter();
    
    if (!emailTransporter) {
      return { success: false, message: 'Email transporter not configured' };
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Greyn Eco Platform'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: confirmationData.to,
      subject: `Support Request Received: ${confirmationData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              margin: -30px -30px 30px -30px;
              text-align: center;
            }
            .content {
              margin-bottom: 30px;
            }
            .details {
              background-color: #f0fdf4;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
              border-left: 4px solid #10b981;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Support Request Received</h2>
            </div>
            
            <div class="content">
              <p>Dear ${confirmationData.name},</p>
              
              <p>Thank you for contacting our support team. We have received your support request and will respond within 24 hours.</p>
              
              <div class="details">
                <p><strong>Request Details:</strong></p>
                <p><strong>Subject:</strong> ${confirmationData.subject}</p>
                <p><strong>Request ID:</strong> ${confirmationData.contactId}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              
              <p>Our support team is reviewing your request and will get back to you as soon as possible.</p>
              
              <p>If you have any urgent concerns, please feel free to contact us directly.</p>
            </div>
            
            <div class="footer">
              <p>This is an automated confirmation email from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}.</p>
              <p>Please do not reply to this email. If you need to add more information, please submit a new support request.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Support Request Received

Dear ${confirmationData.name},

Thank you for contacting our support team. We have received your support request and will respond within 24 hours.

Request Details:
Subject: ${confirmationData.subject}
Request ID: ${confirmationData.contactId}
Submitted: ${new Date().toLocaleString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Our support team is reviewing your request and will get back to you as soon as possible.

If you have any urgent concerns, please feel free to contact us directly.

This is an automated confirmation email from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}.
Please do not reply to this email. If you need to add more information, please submit a new support request.
      `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Support confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending support confirmation email:', error.message || error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
};

/**
 * Send project approval email to NGO
 */
const sendProjectApprovalEmail = async ({ to, ngoName, projectName, projectId, comment }) => {
  if (!emailEnabled || !nodemailer) {
    console.warn('⚠️ Email sending is disabled. Project approval email not sent.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const emailTransporter = initEmailTransporter();
    if (!emailTransporter) {
      console.warn('⚠️ Email transporter not configured. Project approval email not sent.');
      return { success: false, message: 'Email transporter not configured' };
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Greyn Eco Platform'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: to,
      subject: `🎉 Your Project "${projectName}" Has Been Approved!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 10px; }
            .content { margin-bottom: 30px; }
            .success-badge { background-color: #10b981; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .details { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .details-row { margin: 8px 0; }
            .label { font-weight: bold; color: #6b7280; }
            .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}</div>
            </div>
            <div class="content">
              <h2>🎉 Great News! Your Project Has Been Approved</h2>
              <p>Dear ${ngoName},</p>
              <p>We're excited to inform you that your project has been reviewed and <strong>approved</strong> by our team!</p>
              
              <div class="success-badge">✓ Project Approved</div>
              
              <div class="details">
                <div class="details-row"><span class="label">Project Name:</span> ${projectName}</div>
                <div class="details-row"><span class="label">Project ID:</span> ${projectId}</div>
                <div class="details-row"><span class="label">Status:</span> Active</div>
              </div>

              ${comment ? `<p><strong>Admin Comment:</strong> ${comment}</p>` : ''}

              <p>Your project is now live and available for funding on our platform. You can start receiving donations and track your progress through your NGO dashboard.</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/ngo/dashboard" class="button">View Dashboard</a>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            </div>
            <div class="footer">
              <p>This is an automated notification from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Great News! Your Project Has Been Approved\n\nDear ${ngoName},\n\nWe're excited to inform you that your project "${projectName}" (ID: ${projectId}) has been reviewed and approved by our team!\n\nYour project is now live and available for funding on our platform. You can start receiving donations and track your progress through your NGO dashboard.\n\n${comment ? `Admin Comment: ${comment}\n\n` : ''}Visit your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/ngo/dashboard\n\nIf you have any questions or need assistance, please don't hesitate to contact our support team.\n\nThis is an automated notification from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}.`
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Project approval email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending project approval email:', error.message || error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
};

/**
 * Send project rejection email to NGO
 */
const sendProjectRejectionEmail = async ({ to, ngoName, projectName, projectId, reason }) => {
  if (!emailEnabled || !nodemailer) {
    console.warn('⚠️ Email sending is disabled. Project rejection email not sent.');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const emailTransporter = initEmailTransporter();
    if (!emailTransporter) {
      console.warn('⚠️ Email transporter not configured. Project rejection email not sent.');
      return { success: false, message: 'Email transporter not configured' };
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Greyn Eco Platform'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: to,
      subject: `Project Review: "${projectName}" Requires Revisions`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 10px; }
            .content { margin-bottom: 30px; }
            .warning-badge { background-color: #f59e0b; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .details { background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .details-row { margin: 8px 0; }
            .label { font-weight: bold; color: #6b7280; }
            .reason-box { background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ef4444; }
            .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}</div>
            </div>
            <div class="content">
              <h2>Project Review Update</h2>
              <p>Dear ${ngoName},</p>
              <p>Thank you for submitting your project for review. After careful evaluation, we need to request some revisions before we can approve your project.</p>
              
              <div class="warning-badge">⚠️ Revisions Required</div>
              
              <div class="details">
                <div class="details-row"><span class="label">Project Name:</span> ${projectName}</div>
                <div class="details-row"><span class="label">Project ID:</span> ${projectId}</div>
                <div class="details-row"><span class="label">Status:</span> Rejected (Pending Revisions)</div>
              </div>

              <div class="reason-box">
                <p><strong>Reason for Rejection:</strong></p>
                <p>${reason}</p>
              </div>

              <p>We encourage you to review the feedback above and resubmit your project with the necessary revisions. Our team is here to help you succeed, so please don't hesitate to reach out if you have any questions.</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/ngo/dashboard" class="button">View Dashboard</a>
              
              <p>You can submit a new project or revise your existing submission through your NGO dashboard.</p>
            </div>
            <div class="footer">
              <p>This is an automated notification from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Project Review Update\n\nDear ${ngoName},\n\nThank you for submitting your project for review. After careful evaluation, we need to request some revisions before we can approve your project.\n\nProject Name: ${projectName}\nProject ID: ${projectId}\nStatus: Rejected (Pending Revisions)\n\nReason for Rejection:\n${reason}\n\nWe encourage you to review the feedback above and resubmit your project with the necessary revisions. Our team is here to help you succeed, so please don't hesitate to reach out if you have any questions.\n\nVisit your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/ngo/dashboard\n\nYou can submit a new project or revise your existing submission through your NGO dashboard.\n\nThis is an automated notification from ${process.env.PLATFORM_NAME || 'Greyn Eco Platform'}.`
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Project rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending project rejection email:', error.message || error);
    return { success: false, message: error.message || 'Failed to send email' };
  }
};

module.exports = {
  initEmailTransporter,
  verifyEmailConnection,
  sendInvitationEmail,
  sendSupportEmail,
  sendSupportConfirmationEmail,
  sendProjectApprovalEmail,
  sendProjectRejectionEmail,
};
