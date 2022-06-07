const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../ultis/catchAsync')
const User = require('../models/user')
const passport = require('passport')
const user = require('../functions/user')

router.get('/register', user.renderRegister)
router.post('/register', catchAsync(user.register))

router.get('/login', user.renderLogin)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login);
router.get('/logout', user.logout)
module.exports = router