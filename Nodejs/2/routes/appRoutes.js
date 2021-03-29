const express = require('express');
const Router = express.Router();
const companyRoute = require('./companyRoute');
const employeeRoute = require('./employeeRoute');
const companies = require('../controllers/companyController');


// root: companies page
Router.get('/', companies.getCompanies);

// company route
Router.use('/company', companyRoute);

// employee route
Router.use('/employee', employeeRoute);


module.exports = Router;