import { Client, Databases } from 'node-appwrite';
import nodemailer from 'nodemailer';

export default async ({ req, res, log, error }) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.json({ success: false, message: 'Method not allowed' }, 405);
    }

    try {
        // Parse the request body
        const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        log('Form submission received');

        // Honeypot spam protection
        if (data._gotcha || data._honeypot) {
            log('Spam detected via honeypot');
            return res.json({ success: false, message: 'Spam detected' }, 400);
        }

        // Validate required fields
        if (!data.Email || !data.Message) {
            return res.json({
                success: false,
                message: 'Email and Message are required'
            }, 400);
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.Email)) {
            return res.json({
                success: false,
                message: 'Invalid email address'
            }, 400);
        }

        // Optional: Store in Appwrite Database
        // Uncomment if you want to save submissions
        /*
        const client = new Client()
          .setEndpoint(process.env.APPWRITE_ENDPOINT)
          .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
          .setKey(process.env.APPWRITE_API_KEY);

        const databases = new Databases(client);

        await databases.createDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID,
          'unique()',
          {
            firstName: data['First Name'] || '',
            lastName: data['Last Name'] || '',
            email: data.Email,
            phone: data.Phone || '',
            countryCode: data['Country Code'] || '',
            message: data.Message,
            submittedAt: new Date().toISOString()
          }
        );
        log('Saved to database');
        */

        // Configure Gmail SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use TLS
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        // Prepare email content
        const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1f2937; }
          .value { margin-top: 5px; }
          .message-box { background-color: white; padding: 15px; border-left: 4px solid #1f2937; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            ${data['First Name'] || data['Last Name'] ? `
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data['First Name'] || ''} ${data['Last Name'] || ''}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.Email}</div>
            </div>
            
            ${data['Country Code'] || data.Phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data['Country Code'] || ''} ${data.Phone || ''}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${data.Message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="field">
              <div class="label">Submitted:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

        // Plain text version for email clients that don't support HTML
        const emailText = `
New Contact Form Submission

${data['First Name'] || data['Last Name'] ? `Name: ${data['First Name'] || ''} ${data['Last Name'] || ''}\n` : ''}
Email: ${data.Email}
${data['Country Code'] || data.Phone ? `Phone: ${data['Country Code'] || ''} ${data.Phone || ''}\n` : ''}

Message:
${data.Message}

Submitted: ${new Date().toLocaleString()}
    `;

        // Send email
        await transporter.sendMail({
            from: `"Website Contact Form" <${process.env.GMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL,
            replyTo: data.Email,
            subject: `New Contact Form Submission from ${data['First Name'] || data.Email}`,
            text: emailText,
            html: emailHtml
        });

        log('Email sent successfully');

        return res.json({
            success: true,
            message: 'Form submitted successfully'
        });

    } catch (err) {
        error(`Error processing form: ${err.message}`);
        return res.json({
            success: false,
            message: 'An error occurred while processing your submission'
        }, 500);
    }
};
