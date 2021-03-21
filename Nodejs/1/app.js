const express = require('express');
const mongoose = require('mongoose');
const app = express();
const appRoute = require('./routes/appRoutes');


// connect MongoDB
mongoose.connect('mongodb://localhost:27017/hw17-1-corporate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// request body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use('/', appRoute);

// 404: not found page
app.use('*', (request, response) => {
    response.status(404).send('404: not Found!');
});


// app listen
app.listen(8000, () => {
    console.log('Server is Running on :8000 ...');
});