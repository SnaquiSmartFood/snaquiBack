const express = require('express')
const cors = require('cors')
const api = require('./api')
const morgan = require('morgan');
const responseFormater = require('./utils/ResponseFormater');

const app = express();

//------------------------------------------------------middlewares-------------------------------

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()) //parsing application/json
// CORS
app.use(
    cors({
        origin: true,
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        credentials: true 
    }),
);


//------------------------------------------------------routes------------------------------------------
app.use('/api', api)
app.get('/', (req, res) => {
    res.send({ response: "I am alive, V0.0.1" }).status(200);
})


//no route found
app.use((_req, _res, next) => {
    next({
        statusCode: 404,
        message: 'path not found'
    })
})
//-------------------------------------------------------------error------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, next) => {
    const { message, statusCode = 500, type='E_ERROR' ,formatedResponse} = err
    if(formatedResponse) {
        res.status(formatedResponse.error.status).json(formatedResponse)
        return
    }
    const formatedError = responseFormater({

        code:statusCode,
        error:{
            "status":statusCode,
            "type": type,
            "detail": message
        },
    })
    
    res.status(statusCode).json(formatedError)
})

module.exports = app