const User = require('../model/user')
const {validationResult} = require('express-validator')
const {FrontEndValidationError} = require('../../util/exception')
const passport = require('passport');
const jwt = require('jsonwebtoken')
require('../middleware/passport')(passport);
const mongoose = require('mongoose')
const {pagination} = require('../repository/common')

const country_state_district = require('country_state_district');
const {SUPER_SECRET_KEY} = require('../../config/app_config')
const asyncHandler = require('../middleware/async_handler')

const {
    createUser,
    fetchUser,
    usersByAdminId,
    createBulkUser,
    importUserExcelData
} = require('../repository/user')

const e = module.exports

e.createUser = asyncHandler(async (req, res, next) => {
    const errMsg = validationResult(req)
    if (!errMsg.isEmpty()) throw new FrontEndValidationError(errMsg)

    const createdUser = createUser(req)
    await createdUser.save()
    return res.success({
        message: "user created successfully!",
        user: createdUser
    })
})

e.updateUser = asyncHandler(async (req, res, next) => {
    const errMsg = validationResult(req)
    if (!errMsg.isEmpty()) throw new FrontEndValidationError(errMsg)

    await User.findOneAndUpdate({_id: req.body.id}, req.body, function (error, place) {
        if (!error)
            return res.success({
                message: "user updated successfully!",
            })
        else return res.failed()
    })
})

e.fetchUsers = asyncHandler(async (req, res, next) => {



    const ObjectId = mongoose.Types.ObjectId

    const adminId = req.query.adminId
    const mType = typeof adminId
    let query


    if (mType !== "undefined" && adminId !== "")
        query = User.find({createdBy: req.query.adminId})
    else query = User.find({createdBy: ObjectId(req.user._id.toString()),})

    const searchType = req.query.searchType
    const searchValue = req.query.searchValue
    if(searchType === 'mobile')
       if(searchValue !== '')
           query.find({mobile : searchValue})
    if(searchType === 'name')
        query.find({name: {'$regex': searchValue, $options: 'i'}})
    if(searchType === 'flatNo')
        query.find({flatNo: {'$regex': searchValue, $options: 'i'}})
    if(searchType === 'email')
        query.find({email: {'$regex': searchValue, $options: 'i'}})




    const total = await User.countDocuments()
    const paginationData = await pagination(req, query, total)

    return res.success({
        users: paginationData.documents,
        count: paginationData.count,
        pagination: paginationData.pagination
    })

})

e.fetchStates = asyncHandler(async (req, res, next) => {
    const states = country_state_district.getAllStates(5);
    if (states instanceof Array) {
        const mStates = states.map((state) => {
            return {
                id: state.id,
                name: state.name
            }
        })
        return res.success({
            message: (mStates.length > 0) ? "State found" : "State not found",
            states: mStates
        })
    } else return res.serverError()
})

e.fetchDistrictsByStateId = asyncHandler(async (req, res, next) => {
    const stateId = req.query.stateId
    const districts = await country_state_district.getDistrictsByStateId(stateId);
    return res.success({
        districts: districts,
        message: (districts.length > 0) ? "districts found" : "district not found"
    })
})

e.loginUser = asyncHandler(async (req, res, next) => {
    const errMsg = validationResult(req)
    if (!errMsg.isEmpty()) throw new FrontEndValidationError(errMsg)

    const user = await User.findOne({email: req.body.email})
    if (!user) return res.failed("Wrong credential");

    user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
            const token = jwt.sign(user.toJSON(), SUPER_SECRET_KEY, {expiresIn: '8h',});
            res.success({token: token, user: user})
        } else res.failed("Wrong credential");
    });
})


e.saveFcmToken = asyncHandler(async (req, res, next) => {
    const loggedInUser = req.user
    User.findOneAndUpdate({_id: loggedInUser._id}, {$set: {fcmToken: req.body.token}}, {multi: true}, (err, doc) => {
        if (err) return res.failed()
        return res.success({
            message: "fcm token saved successfully",
        })
    })
})

e.importUserExelData = asyncHandler(async (req, res, next) => {
    const mUser = await User.findOne({mobile: req.body.adminMobile})
    const adminId = mUser._id.toString();

    const userListData = await importUserExcelData(req.file.path)

    const lookUpMobile = userListData.reduce((a, e) => {
        a[e.mobile] = ++a[e.mobile] || 0;
        return a;
    }, {});
    const duplicateMobileList = userListData.filter(e => lookUpMobile[e.mobile]);


    const lookUpEmail = userListData.reduce((a, e) => {
        a[e.email] = ++a[e.email] || 0;
        return a;
    }, {});
    const duplicateEmailList = userListData.filter(e => lookUpEmail[e.email]);

    const lookUpAadhaarNo = userListData.reduce((a, e) => {
        a[e.aadhaarNumber] = ++a[e.aadhaarNumber] || 0;
        return a;
    }, {});
    const duplicateAadhaarList = userListData.filter(e => lookUpAadhaarNo[e.aadhaarNumber]);

    if (duplicateMobileList.length > 0 || duplicateEmailList.length > 0 || duplicateAadhaarList.length > 0) {
        return res.json({
            status: 10,
            message: "duplicate values found!",
            duplicateMobileList,
            duplicateEmailList,
            duplicateAadhaarList,
        })
    }

    const usersCreated = await createBulkUser(userListData, adminId)
    return res.success({usersCreated: usersCreated})
})

