# Email Configuration Guide

To enable email sending for invitations, you need to configure SMTP settings in your `.env` file.

## Environment Variables

Add the following to your `backend/.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Alternative: Use EMAIL_USER and EMAIL_PASSWORD
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Email Settings
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Greyn Eco Platform
PLATFORM_NAME=Greyn Eco Platform
PLATFORM_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

## Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Greyn Eco" as the name
   - Copy the 16-character password
3. **Update `.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

## Other Email Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

### Outlook/Office 365
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Custom SMTP
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Testing

After configuring, restart your backend server. When you create or resend an invitation, the system will:

1. Create the invitation in the database
2. Send an email to the recipient with:
   - Invitation code
   - Accept link
   - Expiry date
   - Role and portal information

## Troubleshooting

- **Email not sending**: Check server logs for error messages
- **Authentication failed**: Verify SMTP credentials are correct
- **Connection timeout**: Check SMTP_HOST and SMTP_PORT settings
- **Development mode**: If no email credentials are set, the system will log a warning but continue working (emails won't be sent)

## Production

For production, use a professional email service like:
- SendGrid
- Mailgun
- Amazon SES
- Postmark
- Resend

Ensure proper SPF, DKIM, and DMARC records are configured for your domain.
