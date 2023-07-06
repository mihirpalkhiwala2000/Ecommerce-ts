"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var validator_1 = require("validator");
var constant_1 = require("../../constant");
var errorMsgs = constant_1.default.errorMsgs;
var emailError = errorMsgs.emailError, ageError = errorMsgs.ageError;
var userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: function (value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error(emailError);
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
        validate: function (value) {
            if (value < 0) {
                throw new Error(ageError);
            }
        },
    },
    role: {
        type: Number,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
userSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};
var User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=user-models.js.map