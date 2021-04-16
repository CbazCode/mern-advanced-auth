require('dotenv').config({path: "./config.env"})


const express = require('express');
const dbConnection = require('./config/db');
const app = express();
const errorHandler = require('./middleware/error');


const PORT = process.env.PORT || 5000;

dbConnection();

app.use(express.json());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/private',require('./routes/private'));

//Error handler (should be last piece of midleware)
app.use(errorHandler);

app.listen( PORT , () => {
    console.log(`Server on port ${PORT}`)
})

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged error: ${err}`);
    server.close(() => process.exit(1));
})