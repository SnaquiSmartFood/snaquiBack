var jwt = require('jsonwebtoken');
const { jwtSecret } = require('../settings');


module.exports = async function ValidateAuthorization(req, res, next) {
    // validate adminconst body = {...req.body}
    try {
        const token = req.headers?.authorization?.replace('Bearer ', '') || ''
        var decode = (token && token !== 'null') ? jwt.verify(token, jwtSecret) : undefined;
        if (decode) {
            const isAdmin = false
            if (isAdmin) {
                next()
            } else {
                return next({
                    statusCode: 403,
                    message: 'the user is not a editor',
                    type:'E_ERROR'
                })
            }
        } else {
            next({
                statusCode: 401,
                message: 'Token error',
                type:'E_NOTICE'
            })
        }
    } catch (error) {
        return next({
            statusCode:500,
            message: error.message,
            type:'E_ERROR'
        })
    }
}