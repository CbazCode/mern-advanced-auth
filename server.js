require('dotenv').config({path: "./config.env"})

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;


app.use('/api/auth',require('./routes/auth'));

app.listen( PORT , () => {
    console.log(`Server on port ${PORT}`)
})