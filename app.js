if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const expressErr = require("./utils/expressErr.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const atlasURL = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(atlasURL);
}
main()
    .then((res)=>{
        console.log("Connected");
    })
    .catch((err)=>{
        console.log("error connecting DB");
    });

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs", ejsMate);


const store = MongoStore.create({
    mongoUrl : atlasURL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*60*60,
});
store.on("error", ()=>{
    console.log("Error in Mongo Session Store", err);
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000*60*60*24*3,
        maxAge : 1000*60*60*24*3,
        httpOnly : true
    }
}

// app.get("/", (req, res)=>{
//     res.send("Hello, please redirect to /listings route");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "Delta",
//     });
//     let registeredUser = await User.register(fakeUser, "Password");
//     res.send(registeredUser);
// });

app.use("/listings", listingsRouter); // Getting all routes using express Router from listing.js
app.use("/listings/:id/reviews", reviewsRouter); // --//--
app.use("/", userRouter);

// Going to any unknown route will show page not found
app.all("*",(req, res, next)=>{
    next(new expressErr(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next)=>{
    let {status=500, message="Something went wrong"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", {message});
});

app.listen(8080, ()=>{
    console.log("Server is listening on 8080");
});