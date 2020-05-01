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
    challenge: {
      type: String,
      required: true
    },
    stage: {
      type: Number,
      required: true
    }
}, {timestamps: true});

let User = module.exports = mongoose.model('User', userSchema);
