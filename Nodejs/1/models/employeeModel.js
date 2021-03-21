const mongoose = require('mongoose');

const essentialSchema = {
    lowercase: true,
    trim: true
};

const EmployeeSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Types.ObjectId,
        required: [true, 'ece1003: companyID-empty'],
        ref: 'companies'
    },
    firstname: {
        ...essentialSchema,
        type: String,
        required: [true, 'ece1003: firstname-empty'],
        validate(value) {
            if (value.length < 2) throw new Error('ece1001: firstname-length');

            if (!isNaN(value[0])) throw new Error('ece1002: firstname-type');
        }
    },
    lastname: {
        ...essentialSchema,
        type: String,
        required: [true, 'ece1003: lastname-empty'],
        validate(value) {
            if (value.length < 2) throw new Error('ece1001: lastname-length');

            if (!isNaN(value[0])) throw new Error('ece1002: lastname-type');
        }
    },
    gender: {
        ...essentialSchema,
        type: String,
        required: [true, 'ece1003: gender-empty'],
        enum: ['male', 'female', 'none']
    },
    nationalNumber: {
        ...essentialSchema,
        type: String,
        unique: true,
        required: [true, 'ece1003: nationalNumber-empty'],
        validate(value) {
            if (value.length !== 10) throw new Error('ece1001: nationalNumber-length');

            if (isNaN(+value)) throw new Error('ece1002: nationalNumber-type');
        }
    },
    dateOfBirth: {
        ...essentialSchema,
        required: [true, 'ece1003: dateOfBirth-empty'],
        type: Date
    },
    managerStatus: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('employees', EmployeeSchema);