const config = {
    jwtSecret: process.env.SECRET_KEY || 'claveUltraSecreta',
    server: {
        port: process.env.PORT || 3000,
    },
};

module.exports = config;