const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    githubUsername: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    }
});

let User = module.exports = mongoose.model('User', userSchema);
