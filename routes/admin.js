const router=require('express').Router();
const passport=require('passport');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
let Admin=require('../models/admin.model');
router.route('/').post((req, res) => {
  Admin.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/login').post((req, res, next)=> {

    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err)
      if (!user) {
        return res.json('invaliduser')
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.json('valid');
      });
    })(req, res, next);
  });
  router.route('/signup').post((req, res)=> {
    var user = new Admin({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
  
    user.save(function(err) {
      req.logIn(user, function(err) {
        res.json('created');
      });
    });
  });
  router.route('/forgot').post((req, res, next)=> {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        Admin.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.json('invalidemail');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
         var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'rraja9513@gmail.com',
            pass: '7760853180raja'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Node.js Password Admin',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.json('sentresetlink');
    });
  });
  router.route('/reset/:token').post((req, res)=> {
    async.waterfall([
      function(done) {
        Admin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.json('invaliduser');
          }
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
  
          user.save(function(err) {
              done(err, user);
          });
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'rraja9513@gmail.com',
            pass: '7760853180raja'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.json('passwordset');
    });
  });
   module.exports=router;