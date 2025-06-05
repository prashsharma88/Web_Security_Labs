const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],            // defining allowed values.
            default: 'user'                     // defining default value.
        }
    }
);

module.exports = mongoose.model("User", UserSchema);