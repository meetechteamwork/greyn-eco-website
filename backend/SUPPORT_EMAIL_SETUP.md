# Support Email Configuration

This document explains how to configure email functionality for the corporate support system.

## Environment Variables

Add the following to your `backend/.env` file:

```env
# Support Email Configuration
SUPPORT_EMAIL=mfaranakbar30@gmail.com

# Email Configuration (SMTP) - Required for sending emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Settings
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Greyn Eco Platform
PLATFORM_NAME=Greyn Eco Platform
```

## Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Greyn Eco Support" as the name
   - Copy the 16-character password
3. **Update `.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SUPPORT_EMAIL=mfaranakbar30@gmail.com
   EMAIL_FROM=your-email@gmail.com
   ```

## How It Works

When a corporate user submits a support request:

1. **Support Request Saved**: The request is saved to the database
2. **Email to Support Team**: An email is sent to `SUPPORT_EMAIL` (default: mfaranakbar30@gmail.com) with:
   - User's name and email
   - Company name
   - Subject and message
   - Contact ID for tracking
3. **Confirmation Email**: A confirmation email is sent to the corporate user

## Email Templates

The system uses HTML email templates with:
- Professional styling
- Company branding
- All relevant information
- Reply-to address set to the user's email

## Testing

1. Configure your SMTP settings in `.env`
2. Restart your backend server
3. Submit a support request from the corporate portal
4. Check `mfaranakbar30@gmail.com` for the support request email
5. Check the corporate user's email for the confirmation

## Troubleshooting

- **Emails not sending**: Check server logs for error messages
- **Authentication failed**: Verify SMTP credentials are correct
- **Connection timeout**: Check SMTP_HOST and SMTP_PORT settings
- **Emails going to spam**: Configure SPF, DKIM, and DMARC records for production

## Production Recommendations

For production, use a professional email service:
- SendGrid
- Mailgun
- Amazon SES
- Postmark
- Resend

Ensure proper SPF, DKIM, and DMARC records are configured for your domain.
