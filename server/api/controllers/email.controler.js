const ResponseFormater = require("../../utils/ResponseFormater");
const emails = require("../../public/emails");
const nodemailer = require("nodemailer");
const { nodemailerConf, } = require("../../utils/nodemailer.configuration");
const EmailController = {};
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const OAuth2_client = new OAuth2(nodemailerConf.auth.clientId, nodemailerConf.auth.clientSecret)
OAuth2_client.setCredentials({ refresh_token: nodemailerConf.auth.refreshToken })


EmailController.sendNewTemporalUser = async (req, res, next) => {
  const { email, link, name, } = req.body;
  try {
    //const accessToken = await getAccessToken();
    const accessToken = await OAuth2_client.getAccessToken()
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
