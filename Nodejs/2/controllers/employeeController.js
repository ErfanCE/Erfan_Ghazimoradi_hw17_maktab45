const mongoose = require('mongoose');
const Employee = require('../models/employeeModel');
const path = require('path');
const persianDate = require('persian-date');


const thisYear = new Date().getFullYear();

// employee schema pattern
const employeeModel = [
    'companyID',
    'firstname',
    'lastname',
    'gender',
    'nationalNumber',
    'dateOfBirth',
    'managerStatus'
];

function employeeValidation(error) {
    // error(11000): duplicate uniqe properties
    if (error.code === 11000) {
        if (error.message.includes('nationalNumber')) return 'nationalNumber-duplicate';
    }

    // error(ece1001): properties length
    if (error.message.includes('ece1001')) {
        if (error.message.includes('firstname-length')) return 'firstname-length';
        if (error.message.includes('lastname-length')) return 'lastname-length';
        if (error.message.includes('nationalNumber-length')) return 'nationalNumber-length';
    }

    // error(ece1002): properties type
    if (error.message.includes('ece1002')) {
        if (error.message.includes('firstname-type')) return 'firstname-type';
        if (error.message.includes('lastname-type')) return 'lastname-type';
        if (error.message.includes('nationalNumber-type')) return 'nationalNumber-type';
    }

    // error(cast) : properties type
    if (error.message.includes('Cast to ObjectId failed')) return 'companyID-type';
    if (error.message.includes('Cast to Boolean failed')) return 'managerStatus-type';
    if (error.message.includes('Cast to date failed')) return 'dateOfBirth-type';

    // error(ece1003): properties empty value
    if (error.message.includes('ece1003')) {
        if (error.message.includes('firstname-empty')) return 'firstname-empty';
        if (error.message.includes('lastname-empty')) return 'lastname-empty';
        if (error.message.includes('gender-empty')) return 'gender-empty';
        if (error.message.includes('nationalNumber-empty')) return 'nationalNumber-empty';
        if (error.message.includes('dateOfBirth-empty')) return 'dateOfBirth-empty';
        if (error.message.includes('companyID-empty')) return 'companyID-empty';
    }

    // error(enum): properties enum value
    if (error.message.includes('not a valid enum value')) return 'gender-value';

    console.log(error.code, error.message);
    return false;
}

const employeeControll = {
    getEmployees: (request, response) => {
        Employee.find({}, (error, employees) => {
            // unhandled error
            if (error) return response.status(500).send('internal server error');

            // not found: employees not found(exist)
            if (!employees || employees.length === 0) return response.status(404).send('not-exist');

            // format date of birth (persian), calc age
            employees.forEach(employee => {
                let age = thisYear - new Date(employee.dateOfBirth).getFullYear();

                employee.age = age;

                employee.persian = new persianDate(employee.dateOfBirth).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');
            });

            response.render(path.join(__dirname, '../', 'views', 'employeeHome.ejs'), {employees});
        });
    },
    createEmployee: (request, response) => {
        // request body sanitization
        const reqEmployeeKeys = Object.keys(request.body);
        const checkReqEmployeeModel = employeeModel.every(employeeKey => reqEmployeeKeys.includes(employeeKey));

        // bad request: employee request body (employeeModel validation)
        if (reqEmployeeKeys.length !== 7 || !checkReqEmployeeModel) return response.send('400: bad request');

        new Employee(request.body).save({}, (error, employee) => {
            if (error) {
                // bad request: employee properties validation
                if (employeeValidation(error)) return response.send(employeeValidation(error));

                // unhandled error
                return response.status(500).send('500: internal server error');
            }
            if (employee.managerStatus === true) {
                Employee.updateMany({companyID: employee.companyID, _id: {$ne: employee._id}}, {$set: {managerStatus: false}}, (error, employee) => {
                    // unhandled error
                    if (error) return response.status(500).send(error.message);

                    return response.send('created-changed');
                });
            } else return response.send('created');
        });
    },
    readEmployee: (request, response) => {
        const employeeID = request.params.employeeID;

        // bad request: check companyID validation
        if (employeeID.length === 12 || !mongoose.Types.ObjectId.isValid(employeeID)) return response.status(400).send('400: bad request');

        Employee.findById(employeeID, (error, employee) => {
            // unhandled error
            if (error) return response.status(500).send('500: internal server error');

            // not found: employeeID not exist
            if (!employee) return response.status(404).send('not-exist');

            // format date of birth
            let age = thisYear - new Date(employee.dateOfBirth).getFullYear();

            employee.age = age;

            employee.persian = new persianDate(employee.dateOfBirth).toCalendar('gregorian').toLocale('en').format('YYYY-MM-DD');

            employee.miladi = new persianDate(employee.dateOfBirth).toCalendar('gregorian').toLocale('en').format('YYYY-MM-DD');

            response.render(path.join(__dirname, '../', 'views', 'employeeDetail.ejs'), {employee})
        });
    },
    updateEmployee: (request, response) => {
        const employeeID = request.params.employeeID;

        // bad request: check employeeID validation
        if (employeeID.length === 12 || !mongoose.Types.ObjectId.isValid(employeeID)) return response.status(400).send('400: bad request');

        const reqEmployeeKeys = Object.keys(request.body);
        const checkReqEmployeeModel = employeeModel.every(employeeKey => reqEmployeeKeys.includes(employeeKey));

        // bad request: employee request body (employeeModel validation)
        if (reqEmployeeKeys.length !== 7 || !checkReqEmployeeModel) return response.status(400).send('400: bad request');


        Employee.findByIdAndUpdate(employeeID, request.body, {runValidators: true, new: true}, (error, employee) => {
            if (error) {
                // bad request: employee properties validation
                if (employeeValidation(error)) return response.send(employeeValidation(error));

                // unhandled error
                return response.status(500).send('500: internal server error');
            }

            // not found: employeeID not exist
            if (!employee) return response.status(404).send('not-exist');

            // update manager status (if true)
            if(employee.managerStatus === true) {
                Employee.updateMany({companyID: employee.companyID, _id: {$ne: employee._id}}, {$set: {managerStatus: false}}, (error, employee) => {
                    // unhandled error
                    if (error) return response.status(500).send('internal server error');

                    return response.send('updated-changed');
                });
            } else if (employee.managerStatus === false) return response.send('updated');
        });
    },
    deleteEmployee: (request, response) => {
        const employeeID = request.params.employeeID;

        // bad request: check employeeID validation
        if (employeeID.length === 12 || !mongoose.Types.ObjectId.isValid(employeeID)) return response.status(400).send('400: bad request');

        Employee.findByIdAndDelete(employeeID, (error, company) => {
            // unhandled error
            if (error) return response.status(500).send('500: internal server error');

            // not found: employeeID not exist
            if (!company) return response.status(404).send('not-exist');

            return response.status(204).send('deleted');
        });
    },
    mokhaberatEmployees: (request, response) => {
        Employee.find({companyID: '60570f34d1853414508ac336'}).populate('companyID', {companyName: 1}).exec((error, employees) => {
            if (error) return console.log(error);

            // format date of birth (persian), calc age
            employees.forEach(employee => {
                let age = thisYear - new Date(employee.dateOfBirth).getFullYear();

                employee.age = age;

                employee.persian = new persianDate(employee.dateOfBirth).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');
            });

            return response.render(path.join(__dirname, '../', 'views', 'employeeCompany.ejs'), {employees, title: 'Employees(Mokhaberat)'});
        });
    },
    companiesManagers: (request, response) => {
        Employee.find({managerStatus: true}).populate('companyID', {companyName: 1}).exec((error, employees) => {
            if (error) return console.log(error);

            // format date of birth (persian), calc age
            employees.forEach(employee => {
                let age = thisYear - new Date(employee.dateOfBirth).getFullYear();

                employee.age = age;

                employee.persian = new persianDate(employee.dateOfBirth).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');
            });

            return response.render(path.join(__dirname, '../', 'views', 'employeeCompany.ejs'), {employees, title: 'Companies Manager'});
        });
    },
    mokhaberatManager: (request, response) => {
        Employee.find({companyID: '60570f34d1853414508ac336', managerStatus: true}, (error, employee) => {
            if (error) return console.log(error);

            let manager = employee[0];

            manager.persian = new persianDate(manager.dateOfBirth).toCalendar('gregorian').toLocale('en').format('YYYY-MM-DD');

            return response.render(path.join(__dirname, '../', 'views', 'employeeDetail.ejs'), {employee: manager});
        });
    },
    employeeAgeFilter: (request, response) => {
        let twentyYear = new Date(new Date().setFullYear(thisYear - 20));
        let thirtyYear = new Date(new Date().setFullYear(thisYear - 30));

        Employee.find({dateOfBirth: {$lte: twentyYear, $gte: thirtyYear}}, {_id: 0}).populate('companyID', {companyName: 1}).exec((error, employees) => {
            if (error) return response.status(500).json({
                msg: "500: Server internal Error!",
                err: err.message
            });

            // format date of birth (persian), calc age
            employees.forEach(employee => {
                let age = thisYear - new Date(employee.dateOfBirth).getFullYear();

                employee.age = age;

                employee.persian = new persianDate(employee.dateOfBirth).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');
            });

            return response.render(path.join(__dirname, '../', 'views', 'employeeCompany.ejs'), {employees, title: 'Employees (Age: 20-30)'});
        });
    },
    companyEmployees: (request, response) => {
        const targetCompany = request.params.companyID;

        Employee.find({companyID: targetCompany}).populate('companyID', {companyName: 1}).exec((error, employees) => {
            if (error) return console.log(error);

            if (employees.length === 0) return response.render(path.join(__dirname, '../', 'views', '404employee.ejs'));

            // format date of birth (persian), calc age
            employees.forEach(employee => {
                let age = thisYear - new Date(employee.dateOfBirth).getFullYear();

                employee.age = age;

                employee.persian = new persianDate(employee.dateOfBirth).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');
            });

            let targetCompanyName = employees[0].companyID.companyName;

            return response.render(path.join(__dirname, '../', 'views', 'employeeCompany.ejs'), {employees, title: targetCompanyName});
        });
    }
}


module.exports = employeeControll;