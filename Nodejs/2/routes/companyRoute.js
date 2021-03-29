const express = require('express');
const router = express.Router();
const companyControll = require('../controllers/companyController');


// companies
router.get('/companies', companyControll.getCompanies);

// CRUD: Create company
router.post('/create', companyControll.createCompany);

// CRUD: Read company
router.get('/read/:companyID', companyControll.readCompany);

// CRUD: Update company
router.patch('/update/:companyID', companyControll.updateCompany);

// CRUD: Delete company
router.delete('/delete/:companyID', companyControll.deleteCompany);

// state and city to tehran
router.get('/company-filter', companyControll.companyFilterDate);

// state and city to tehran
router.get('/last-year', companyControll.lastYearRegisteration);

router.get('/change-tehran', companyControll.stateCityTehran);
module.exports = router;