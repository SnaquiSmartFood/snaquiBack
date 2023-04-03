const ResponseFormater = require("../../utils/ResponseFormater");
const emails = require("../../public/emails");
const nodemailer = require("nodemailer");
const { nodemailerConf, getAccessToken } = require("../../utils/nodemailer.configuration");
const EmailController = {};

EmailController.sendNewTemporalUser = async (req, res, next) => {
  const { email, link, name, } = req.body;
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
