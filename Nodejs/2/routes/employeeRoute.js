const express = require('express');
const router = express.Router();
const employeeControll = require('../controllers/employeeController');

// employees
router.get('/employees', employeeControll.getEmployees);

// CRUD: Create employee
router.post('/create', employeeControll.createEmployee);

// CRUD: Read employee
router.get('/read/:employeeID', employeeControll.readEmployee);

// CRUD: Update employee
router.patch('/update/:employeeID', employeeControll.updateEmployee);

// CRUD: Delete employee
router.delete('/delete/:employeeID', employeeControll.deleteEmployee);

// mokhaberat(company) employees
router.get('/mokhaberat-employees', employeeControll.mokhaberatEmployees);

// companies managers
router.get('/companies-managers', employeeControll.companiesManagers);

// mokhaberat(company) manager
router.get('/mokhaberat-manager', employeeControll.mokhaberatManager);

// employees age between 20 to 30
router.get('/age-20-30', employeeControll.employeeAgeFilter);

// company employees
router.get('/companyEmployees/:companyID', employeeControll.companyEmployees);

module.exports = router;