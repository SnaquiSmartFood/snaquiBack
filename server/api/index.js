const { Router } = require('express');
const EmailRouter = require('./routes/email.routes');
const JumpsellerRouter = require('./routes/jumpseller.routes');
const router = Router({ mergeParams: true });


router.use('/jumpseller', JumpsellerRouter);
router.use('/email', EmailRouter);
module.exports = router;