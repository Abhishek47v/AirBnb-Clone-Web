const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const uesrController = require("../controllers/users.js");

router.route("/signup")
    .get(uesrController.renderSignupForm)
    .post(wrapAsync (uesrController.signup));

router.route("/login")
    .get(uesrController.renderLoginform)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), uesrController.login);

router.get("/logout", uesrController.logout);

module.exports = router;