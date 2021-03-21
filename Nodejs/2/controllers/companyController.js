const mongoose = require('mongoose');
const Company = require('../models/companyModel');
const path = require('path');
const persianDate = require('persian-date');

// company schema pattern
const companyModel = [
    'companyName',
    'state',
    'city',
    'telephoneNumber',
    'registerationNumber'
];

function companyValidation(error) {
    // error(11000): duplicate uniqe properties
    if (error.code === 11000) {
        if (error.message.includes('companyName')) return 'companyName-duplicate';
        if (error.message.includes('telephoneNumber')) return 'telephoneNumber-duplicate';
        if (error.message.includes('registerationNumber')) return 'registerationNumber-duplicate';
    }

    // error(ece1001): properties length
    if (error.message.includes('ece1001')) {
        if (error.message.includes('companyName-length')) return 'companyName-length';
        if (error.message.includes('state-length')) return 'state-length';
        if (error.message.includes('city-length')) return 'city-length';
        if (error.message.includes('telephoneNumber-length')) return 'telephoneNumber-length';
        if (error.message.includes('registerationNumber-length')) return 'registerationNumber-length';
    }

    // error(ece1002): properties type
    if (error.message.includes('ece1002')) {
        if (error.message.includes('companyName-type')) return 'companyName-type';
        if (error.message.includes('telephoneNumber-type')) return 'telephoneNumber-type';
        if (error.message.includes('registerationNumber-type')) return 'registerationNumber-type';
    }

    // error(ece1003): properties empty value
    if (error.message.includes('ece1003')) {
        if (error.message.includes('companyName-empty')) return 'companyName-empty';
        if (error.message.includes('state-empty')) return 'state-empty';
        if (error.message.includes('city-empty')) return 'city-empty';
        if (error.message.includes('telephoneNumber-empty')) return 'telephoneNumber-empty';
        if (error.message.includes('registerationNumber-empty')) return 'registerationNumber-empty';
    }

    console.log(error.code, error.message);
    return false;
}

const companyControll = {
    getCompanies: (request, response) => {
        Company.find({}, (error, companies) => {
            // unhandled error
            if (error) return response.status(500).send('internal server error');

            // not found: employees not found(exist)
            if (!companies || companies.length === 0) return response.status(404).send('not-exist');

            // format register date: persian
            companies.forEach(company => {
                company.persian = new persianDate(company.registerationDate).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');
            });

            response.render(path.join(__dirname, '../', 'views', 'companyHome.ejs'), {companies});
        });
    },
    createCompany: (request, response) => {
        // request body sanitization
        const reqCompanyKeys = Object.keys(request.body);
        const checkReqCompanyModel = companyModel.every(companyKey => reqCompanyKeys.includes(companyKey));

        // bad request: company request body (companyModel validation)
        if (reqCompanyKeys.length !== 5 || !checkReqCompanyModel) return response.send('empty');

        new Company(request.body).save({}, (error, company) => {
            if (error) {
                // bad request: company properties validation
                if (companyValidation(error)) return response.send(companyValidation(error));

                // unhandled error
                return response.status(500).send('500: internal server error');
            }

            return response.send('created');
        });
    },
    readCompany: (request, response) => {
        const companyID = request.params.companyID;

        // bad request: check companyID validation
        if (companyID.length === 12 || !mongoose.Types.ObjectId.isValid(companyID)) return response.status(400).send('400: bad request');

        Company.findById(companyID, (error, company) => {
            // unhandled error
            if (error) return response.status(500).send('500: internal server error');

            // not found: companyID not exist
            if (!company) return response.status(404).send('not-exist');

            // format register date
            company.persian = new persianDate(company.registerationDate).toCalendar('gregorian').toLocale('en').format('dddd, DD MMMM YYYY, hh:mm:ss');

            response.render(path.join(__dirname, '../', 'views', 'companyDetail.ejs'), {company});
        });
    },
    updateCompany: (request, response) => {
        const companyID = request.params.companyID;

        // bad request: check companyID validation
        if (companyID.length === 12 || !mongoose.Types.ObjectId.isValid(companyID)) return response.status(400).send('400: bad request');

        // request body sanitization
        const reqCompanyKeys = Object.keys(request.body);
        const checkReqCompanyModel = companyModel.every(companyKey => reqCompanyKeys.includes(companyKey));

        // bad request: company request body (companyModel validation)
        if (reqCompanyKeys.length !== 5 || !checkReqCompanyModel) return response.status(400).send('400: bad request');

        
        Company.findByIdAndUpdate(companyID, request.body, {runValidators: true}, (error, company) => {
            if (error) {
                // bad request: company properties validation
                if (companyValidation(error)) return response.send(companyValidation(error));

                // unhandled error
                return response.status(500).send('500: internal server error');
            }

            // not found: companyID not exist
            if (!company) return response.status(404).send('not-exist');

            return response.send('updated');
        });
    },
    deleteCompany: (request, response) => {
        const companyID = request.params.companyID;

        // bad request: check companyID validation
        if (companyID.length === 12 || !mongoose.Types.ObjectId.isValid(companyID)) return response.status(400).send('400: bad request');

        Company.findByIdAndDelete(companyID, (error, company) => {
            // unhandled error
            if (error) return response.status(500).send('500: internal server error');

            // not found: companyID not exist
            if (!company) return response.status(404).send('not-exist');

            return response.status(204).send();
        });
    },
    companyFilterDate: (request, response) => {
        const endDate = new Date(new Date(request.query.endDate));
        const startDate = new Date(new Date(request.query.startDate));

        Company.find({
            registerationDate: {
                $lte: endDate,
                $gte: startDate
            }
        }, (err, companies) => {
            if (err) return response.redirect('/company/companies');
            
            if (companies.length === 0) return response.render(path.join(__dirname, '../', 'views', '404company.ejs'));
            // format register date: persian
            companies.forEach(company => {
                company.persian = new persianDate(company.registerationDate).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');
            });

            response.render(path.join(__dirname, '../', 'views', 'companyHome.ejs'), {companies});
        });
    },
    lastYearRegisteration: (request, response) => {
        const thisYear = new Date();
        const lastYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

        Company.find({registerationDate: {$lt: thisYear, $gt: lastYear}}, (err, companies) => {
            if (err) return response.status(500).json({
                msg: "500: Server internal Error!",
                err: err.message
            });

            // format register date: persian
            companies.forEach(company => {
                company.persian = new persianDate(company.registerationDate).toCalendar('gregorian').toLocale('en').format('ddd, DD MMMM YYYY');
            });

            return response.render(path.join(__dirname, '../', 'views', 'companyHome.ejs'), {companies})
        });
    },
    stateCityTehran: (request, response) => {
        Company.updateMany({}, {$set: {state: 'tehran', city: 'tehran'}}, (err, result) => {
            if (err) return response.status(500).json({
                msg: "500: Server internal Error!",
                err: err.message
            });

            return response.send('state and city changed to tehran');
        });
    }
};


module.exports = companyControll;