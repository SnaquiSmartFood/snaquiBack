const { default: axios } = require("axios")


const jumpsaleApi  = axios.create({
  baseURL: process.env.JUMPSALE_API || 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
  auth:{
    username: process.env.JUMPSALE_LOGIN_TOKEN,
    password: process.env.JUMPSALE_OAUTH_TOKEN
  }
})

module.exports= jumpsaleApi