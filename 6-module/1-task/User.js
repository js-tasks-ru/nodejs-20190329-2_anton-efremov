const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {
        type: String, lowercase: true, trim: true,
        required: true,
        validate: [
            {
                validator(value) {
                    return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
                },
                message: 'Email is not valid',
            },
        ],
        unique: true,
    },
    displayName: {
        type: String, lowercase: true, trim: true,
        required: true,
    }
}, {timestamps: true});

schema.index({ email: 1, displayName: 1 });

module.exports = mongoose.model('User', schema, 'users');
