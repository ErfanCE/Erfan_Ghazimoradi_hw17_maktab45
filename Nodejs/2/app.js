const express = require('express');
const app = express();
const mongoose = require('mongoose');
const appRoutes = require('./routes/appRoutes.js');
const path = require('path');


// connect MongoDB
mongoose.connect('mongodb://localhost:27017/hw17-1-corporate', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// require ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// static public
app.use(express.static('public', {extensions: false}));
app.use('/company', express.static('public'));
app.use('/company/read', express.static('public'));
app.use('/employee', express.static('public'));
app.use('/employee/read', express.static('public'));
app.use('/employee/companyEmployees', express.static('public'));

// request body parser
app.use(express.urlencoded({extended: true}));


// routes
app.use('/', appRoutes);


// 404: not found
app.use('*', (request, response) => {
    response.render(path.join(__dirname, 'views', '404Page.ejs'));
});


app.listen(8000, () => {
    console.log('Server is running on :8000 ...');
});