var express        = require("express"),
    app            = express(),
	 flash          = require("connect-flash"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
	 passport       = require("passport"),
	 LocalStrategy  = require("passport-local"),
	 methodOverride = require("method-override"),
	 Campground     = require("./models/campground"),
	 Comment        = require("./models/comment"),
	 User           = require("./models/user"),
	 seedDB         = require("./seeds")

// dotenv config
require('dotenv').config();

// Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
	 commentRoutes    = require("./routes/comments"),
	 indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// Requiring Routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function(){
  console.log("YELP CAMP HAS STARTED");
});











