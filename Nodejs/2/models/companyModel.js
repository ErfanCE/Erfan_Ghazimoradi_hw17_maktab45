const mongoose = require('mongoose');

const essentialSchema = {
    lowercase: true,
    trim: true
};

// error(ece1001): property-length
// error(ece1002): property-type
const CompnaySchema = new mongoose.Schema({
    companyName: {
        ...essentialSchema,
        type: String,
        unique: true,
        required: [true, 'ece1003: companyName-empty'],
        validate(value) {
            if (value.length < 2) throw new Error('ece1001: companyName-length');

            if (!isNaN(value[0])) throw new Error('ece1002: companyName-type');
        }
    },
    state: {
        ...essentialSchema,
        type: String,
        required: [true, 'ece1003: state-empty'],
        minLength: [2, 'ece1001: state-length']
    },
    city: {
        ...essentialSchema,
        type: String,
        required: [true, 'ece1003: city-empty'],
        minLength: [2, 'ece1001: city-length']
    },
    telephoneNumber: {
        ...essentialSchema,
        type: String,
        unique: true,
        required: [true, 'ece1003: telephoneNumber-empty'],
        validate(value) {
            if (value.length !== 8) throw new Error('ece1001: telephoneNumber-length');

            if (isNaN(+value)) throw new Error('ece1002: telephoneNumber-type');
        }
    },
    registerationNumber: {
        ...essentialSchema,
        type: String,
        unique: true,
        required: [true, 'ece1003: registerationNumber-empty'],
        validate(value) {
            if (value.length !== 10) throw new Error('ece1001: registerationNumber-length');

            if (isNaN(+value)) throw new Error('ece1002: registerationNumber-type');
        }
    },
    registerationDate: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('companies', CompnaySchema);