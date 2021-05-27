const User = require("../../models/user");
var jwt = require("jsonwebtoken");
const bycript = require("bcryptjs");
const crypto = require("crypto");
const io = require("../../socket");

const nodeMailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const nodegride = require("nodemailer-sendgrid-transport");
var jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, "shhhhh", {
    expiresIn: "30 days",
  });
};

const transporter = nodeMailer.createTransport(
  nodegride({
    auth: {
      api_key:
        "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",
    },
  })
);

// SINGUP NEW USER TO THE DATABASE
exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({
      errors: errors.array()[0].msg,
    });
  }
  bycript.hash(req.body.password, 12, (error, hashedpassword) => {
    if (error) {
      return res.status(401).json({
        error,
        success: false,
      });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedpassword,
      bio: req.body.bio,
      phone: req.body.phone,
    });

    return user
      .save()
      .then((user) => {
        const token = signToken(user._id);
        transporter.sendMail({
          to: req.body.email,
          from: "ammarlee16@gmail.com",
          subject: "signup  our account",
          html: `<h1>you have signup new accoiunt in shopping website  </h1>`,
        });
        io.getIO().emit("post", {
          action: "signupNewUser",
          user,
          msg: "signup New User",
        });
        res.status(200).json({
          status: "success",
          user,
          token: token,
          authanticated: true,
          msg: "you have added new user to the databse now ",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          msg: err,
        });
      });
  });
};

// LOGIN WITH YOUR EMAIL AND PASSWORD
exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({
      errors: errors.array()[0].msg,
    });
  }
  const email = req.body.email;
  User.findOne({ email: email })
    .then((user) => {
      var token = signToken(user._id);
      req.session.user = user;
      req.session.token = token;
      req.session.isAuthanticated = true;
      user.userToken = token;
      user.save();
      req.session.date = {
        date: new Date().toLocaleDateString(),
        hour: new Date().toISOString(),
      };

      return res.status(200).send({
        user: user.toJSON(),
        authanticated: true,
        token: token,
        success: true,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        msg: "error with authantication",
        success: false,
        error,
      });
    });
};

// LOG OUT THE CUTRRENT USER
exports.logOut = (req, res, next) => {
  req.session.destroy(function (err) {
    // cannot access session here
    if (err) {
      return res.status(500).send({
        error: "error with authantication",
      });
    }
    console.log("u have loged out ");
    return res.status(200).json({
      msg: "you have logged out succefull",
    });
  });
};

exports.forForgetPassword = (req, res, next) => {
  const token = crypto.createHash("sha256").digest("hex");
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "your email is not  exist yet",
        });
      }
      user.resetToken = token;
      return user
        .save()
        .then(() => {
          transporter.sendMail({
            to: req.body.email,
            from: "ammarlee16@gmail.com",
            subject: "reset your password",
            html: `<h1>are u ready for new applications</h1>
                          <a href="http://localhost:8080/reset/${token}"> rest your password</a>`,
          });
        })
        .then(() => {
          return res.status(200).json({
            success: true,
            msg: "we have sent a massege to your email to reset password",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        success: false,
        err,
      });
    });
};

exports.getUserToken = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          err,
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        success: false,
        err,
      });
    });
};

exports.resetAfterForget = async (req, res, next) => {
  const userId = req.body.user._id;
  // const userId=req.body.userId
  const token = req.body.token;
  const password = req.body.password;
  const secPassword = req.body.secPassword;
  try {
    const user = await User.findOne({ _id: userId, resetToken: token });
    if (password === secPassword) {
      bycript.hash(req.body.password, 12, (error, hashedpassword) => {
        if (error) {
          return res.status(401).json({
            success: false,
            err: "error with hash password",
          });
        }
        user.password = hashedpassword;
        user.resetToken = null;
        user.save();
        return res.status(200).json({
          success: true,
          msg: "you have changed your password",
        });
      });
    } else {
      return res.status(401).json({
        success: false,
        err: "your password is not match ",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      err: error,
    });
  }
};
