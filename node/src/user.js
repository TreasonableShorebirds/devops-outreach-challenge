const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    githubUsername: {
        type: String,
        required: true
    },
    secretKey: {
        type: String,
        required: false
    },
    encryptedKey: {
        type: String,
        required: false
    },
    stepsComplete: {
        type: Array,
        required: true
    }
});

let User = module.exports = mongoose.model('User', userSchema);
