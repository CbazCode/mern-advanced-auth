const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.AUTH_CLIENT_ID,
    process.env.AUTH_CLIENT_SECRET,
    process.env.AUTH_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.AUTH_REFRESH_TOKEN });

const sendMail = async(options) =>{

    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth:{
            type: 'OAuth2',
            user: process.env.EMAIL_FROM,
            clientId: process.env.AUTH_CLIENT_ID,
            clientSecret: process.env.AUTH_CLIENT_SECRET,
            refreshToken: process.env.AUTH_REFRESH_TOKEN,
            accessToken: accessToken,
        }
    });
    //console.log(options.text)
    const mailOptions= {
        from: process.env.EMAIL_FROM,
        to:options.to,
        subject: options.subject,
        html:options.text
    }
    
    transporter.sendMail(mailOptions, function(err,info){
        if(err){
            console.log(err)
        }else{
            console.log(info)
        }
    })
}

module.exports = sendMail;