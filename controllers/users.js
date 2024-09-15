const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const regUser = await User.register(newUser, password);
        // auto login registered User
        req.login(regUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "User Registered Successfully");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error", "User Already Registered");
        res.redirect("/signup");
    }
};

module.exports.renderLoginform = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req, res)=>{
    req.flash("success","Welcome to Website");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res)=>{
    req.logout((err) => {
        if(err){
            return next(err); 
        }
        req.flash("success", "Logged Out Successfully");
        res.redirect("/listings");
    });
};