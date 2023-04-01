const ResponseFormater = require("../../utils/ResponseFormater");
const { google } = require("googleapis");
const emails = require("../../public/emails");
const nodemailer = require("nodemailer");
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

const EmailController = {};

EmailController.sendEmail = async (req, res, next) => {
  const { email, link, name } = req.body;
  try {
    const accessToken = await getAccessToken();
    const config = { ...nodemailerConf };
    var body = emails.resgisterTemporalUser(link) || "";

    config.auth.accessToken = accessToken.token;
    const transporter = nodemailer.createTransport(config);
    var mailOptions = {
      from: `"Snaqui" <${nodemailerConf.auth.user}>`,
      to: email,
      subject: `${name}`,
      html: body,
    };
    const info = await transporter.sendMail(mailOptions);
    const formatedResponse = ResponseFormater({
      data: info,
    });
    res.status(200).json(formatedResponse);
  } catch (error) {
    next({
      statusCode: 500,
      message: error.message,
      type: "E_ERROR",
    });
  }
};

module.exports = EmailController;
