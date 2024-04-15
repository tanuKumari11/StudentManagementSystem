const Joi = require('joi');
const mongoose = require('mongoose');
//const mongoosePaginate = require('mongoose-paginate');

const studentIdSchema = new mongoose.Schema({
    ClassRollNo: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 3;
            },
            message: 'Roll must be greater than 3'
        }
    },
    RegistrationNo: {
        type: String
    }
});

const StudentId = mongoose.model('StudentId', studentIdSchema);

const studentSchema = new mongoose.Schema({
    StudentName: {
        FirstName: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true
        }
    },
    Gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    DateOfBirth: {
        type: String,
        required: true
    },
    DateOfAdmission: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true,
        enum: ['General', 'OBC', 'SC', 'ST', 'Others']
    },
    Religion: {
        type: String,
        required: true,
        enum: ['Muslim', 'Hindu', 'Sikh', 'Christian', 'Jain', 'Others']
    },
   
    Email: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    Address: {
        Address_Line_1: {
            type: String,
            required: true
        },
        City: {
            type: String,
            required: true
        },
        State: {
            type: String,
            required: true
        },
        PostalCode: {
            type: String,
            required: true
        },
        Country: {
            type: String,
            required: true
        }
    }
});

//studentSchema.plugin(mongoosePaginate);

const Student = mongoose.model('Student', studentSchema);

function validateStudent(student) {
    const schema = {
        FirstName: Joi.string().alphanum().regex(/[a-zA-Z]/).required().label(' First Name '),
        LastName: Joi.string().required(),
        Gender: Joi.string().required(),
        Category: Joi.string().required(),
        DateOfBirth: Joi.string().required(),
        DateOfAdmission: Joi.string().required(),
        Religion: Joi.string().required(),
        // FathersName: Joi.string().required(),
        // FathersEducationalQualification: Joi.string().required(),
        // FathersOccupation: Joi.string().required(),
        // MothersName: Joi.string().required(),
        // MothersEducationalQualification: Joi.string().required(),
        // MothersOccupation: Joi.string().required(),
        Email: Joi.string().email().required(),
        PhoneNumber: Joi.number().integer().positive().required(),
        Address: Joi.string().required(),
        City: Joi.string().required(),
        State: Joi.string().required(),
        PostalCode: Joi.number().required(),
        Country: Joi.string().required(),
        // CourseName: Joi.string().required().label(' Course Name '),
        // BranchName: Joi.string().required().label(' Branch Name '),
        // ClassAdmittedTo: Joi.string().required(),
        // Section: Joi.string().required(),
        // Session: Joi.string().required(),
        // ClassRollNo: Joi.string().required(),
        // RegistrationNo: Joi.string().empty(''),
        // _method: Joi.string().empty('')
    };

    return Joi.validate(student, schema);
}

exports.StudentId = StudentId;
exports.Student = Student;
exports.validate = validateStudent;