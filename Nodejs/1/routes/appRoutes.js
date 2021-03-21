const express = require('express');
const Router = express.Router();
const companyRoute = require('./companyRoute');
const employeeRoute = require('./employeeRoute');


// root: companies page
Router.use('/', companyRoute);

// company route
Router.use('/company', companyRoute);

// employee route
Router.use('/employee', employeeRoute);


module.exports = Router;