const express = require('express')
const route=express.Router();
const passport=require('passport')
const users=require('../controllers/users')
const {isLoggedIn}=require('../middleware')
route.route('/login')
    .get(users.loginPage)
    .post(passport.authenticate('local',{failureRedirect: '/user/login', failureFlash: true,keepSessionInfo: true}),users.login)
route.route('/register')
    .get(users.addPage)
    .post(users.add)
route.get('/logout',isLoggedIn,users.logout)


module.exports=route