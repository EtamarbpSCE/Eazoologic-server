const Resend = require('resend');
const resend = new Resend.Resend(process.env.RESEND_API_KEY);

const clientURL = process.env.CLIENT_URL
const companyName = process.env.COMPANY_NAME
const sendEmailNewUser = (email, token) =>{

    resend.emails.send({
        from: 'info@easzoologic.xyz',
        to: [email],
        subject: `Welcome To${companyName} App`,
        html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    Hello,
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    An account has been created for you by the admin of ${companyName}. To get started, you'll need to set up a password for your new account.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    Please click the link below to set up your password:
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #007BFF;">
                    <a href="${clientURL + '?token=' + token}" style="color: #007BFF; text-decoration: none;">Set up new password</a>
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <strong>Note:</strong> Use your email address as your username when setting up your password.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    If you have any questions or need assistance, please do not hesitate to contact us.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    Best regards,<br/>
                    The ${companyName} Team
                </p>`
                    });
}

const sendEmailPasswordReset = (email, token) =>{

    resend.emails.send({
        from: 'info@easzoologic.xyz',
        to: [email],
        subject: `${companyName} App Password reset.`,
        html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    Hello,
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    We received a request to reset your password. If you did not make this request, please disregard this email and contact our support team immediately.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    To set up a new password, please click the link below:
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #007BFF;">
                    <a href="${clientURL + '?token=' + token}" style="color: #007BFF; text-decoration: none;">Set up a new password</a>
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    <strong>Note:</strong> Use your email address as your username when setting up your new password.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    If you have any questions or need further assistance, feel free to contact us.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    Best regards,<br/>
                    ${companyName} Support Team
                </p>`
    });
}

const sendEmailRegistrationSuccesfull = (email) =>{

    resend.emails.send({
        from: 'info@easzoologic.xyz',
        to: [email],
        subject: `Your password has changed To ${companyName} App`,
        html: ` <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    Hello,
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    We wanted to let you know that your password has been successfully changed.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    If you did not make this change or if you encounter any issues, please contact our support team immediately.
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    Thank you for using the <strong>${companyName} App</strong>!
                </p>
                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                    Best regards,<br/>
                    The ${companyName} Team
                </p>
                `
    });
}

module.exports = {sendEmailNewUser, sendEmailRegistrationSuccesfull, sendEmailPasswordReset};
