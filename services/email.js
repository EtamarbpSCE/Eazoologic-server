const Resend = require('resend');
const resend = new Resend.Resend(process.env.RESEND_API_KEY);

const clientURL = process.env.CLIENT_URL
const sendEmailNewUser = (email, token) =>{

    resend.emails.send({
        from: 'info@easzoologic.xyz',
        to: [email],
        subject: 'Welcome To Easzoological App',
        html: `<p>The admin of Eazoologic has created a user for you, <br/> use this link to set up new password <a href=${clientURL +'?token='+ token}> Set up new password </a> <br/> <strong>Use your email as the user name</strong></p>`
    });
}

const sendEmailRegistrationSuccesfull = (email) =>{

    resend.emails.send({
        from: 'info@easzoologic.xyz',
        to: [email],
        subject: 'Your password has changed To Easzoological App',
        html: `<p>Your password has been changed sucessfully! <br/> <b> Easzoologic App </b> </p>`
    });
}

module.exports = {sendEmailNewUser, sendEmailRegistrationSuccesfull};
