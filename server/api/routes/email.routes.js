const { Router } = require('express');
const EmailController = require('../controllers/email.controler');

const EmailRouter = Router({ mergeParams: true });

/*CRUD de los lugares del usuario*/


EmailRouter.get('/send', EmailController.sendEmail);

module.exports = EmailRouter;