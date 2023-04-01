require('dotenv').config();
const settings = require('./server/settings');

const app = require('./server');
const { port } = settings.server

app.listen(port, () => {
    console.log(`Server running at port: ${port}`)
}) 