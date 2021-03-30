const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const {Collection} = require('../../util/constant')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name field is required"],},
    mobile: {type: Number,
        required: [true, "Mobile field is required"],
        unique: [true, "Mobile field already exist"]},
    email: {type: String,
        required: [true, "email field is required"],
        unique: [true, "Email field already exist"]},
    role: {
        type: String,
        default: "user",
        enum: ["user", "society_admin", "app_admin", "guard"]},
    password: {
        type: String,
        required: [true, "Password is required"]},
    active: {
        type: Boolean,
        default: true},
    aadhaarNumber: {
        type: Number,
        required: [true, "Aadhar number field is required"],
        unique: [true, "Aadhar number is already exist"]
    },
    floorNo: {type: Number},
    towerNo: {type: String,},
    flatNo: {type: String,},
    totalMember: {type: Number,},
    guardAddress: {type: String,},
    fcmToken: {type: String},
    createdBy: {type: mongoose.Types.ObjectId, ref: Collection.USER},
    societyInfo: {
        _id : 0,
        name: String,
        district : String,
        state : String,
        addressLine1 : String,
        addressLine2 : String,
        pinCode : String,
        picUrl : String
    },
})


UserSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model(Collection.USER, UserSchema)