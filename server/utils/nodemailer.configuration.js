
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const nodemailerConf = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.NODEMAILER_USER || "america.ratke@ethereal.email",
    clientId: process.env.NODEMAILER_CLIENT_ID,
    clientSecret: process.env.NODEMAILER_CLIENT_SECRET,
    refreshToken: process.env.NODEMAILER_REFRESH_TOKEN,
  },
};
const getAccessToken = async () => {
  const OAuth2_client = new OAuth2(
    nodemailerConf.auth.clientId,
    nodemailerConf.auth.clientSecret,
    process.env.NODEMAILER_REDIRECT_URI
  );
  OAuth2_client.setCredentials({
    refresh_token: nodemailerConf.auth.refreshToken,
    tls: {
      rejectUnauthorized: false,
    },
  });
  return await OAuth2_client.getAccessToken();
};

module.exports = {
    getAccessToken,
    nodemailerConf
  
  }
