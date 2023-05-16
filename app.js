if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  
  const express = require("express");
  const app = express();
  const mongoose = require("mongoose");
  const session = require("express-session");
  const ejsMate = require("ejs-mate");
  const methodOverride = require("method-override");
  const campgroundRoute = require("./routes/campground");
  const reviewRoute = require("./routes/review");
  const userRoute = require("./routes/user");
  const flash = require("connect-flash");
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const User = require("./model/user");
  
  // URL of the database
  const DBUrl = "mongodb://localhost:27017/yelp-camp";
  
  const MongoStore = require('connect-mongo')
  
  mongoose.set("strictQuery", false);
  
  mongoose.connect(DBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const store = MongoStore.create({
    mongoUrl: DBUrl,
    secret: 'goodsecret',
    touchAfter: 24 * 60 * 60,
});
  
  const sessionConfig = {
    store,
    name: "session",
    secret: "itisagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 3600 * 24 * 7,
    },
  };
  
  app.use(session(sessionConfig));
  
  const path = require("path");
  app.engine("ejs", ejsMate);
  app.use(methodOverride("_method"));
  
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  
  const publicDirectoryPath = path.join(__dirname, "/public");
  app.use(express.static(publicDirectoryPath));
  
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
  });
  
  app.use("/user", userRoute);
  app.use("/campground", campgroundRoute);
  app.use("/campground/:id/review", reviewRoute);
  app.get("/", (req, res) => {
    res.render("home");
  });
  
  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong!";
    res.status(statusCode).render("error", { err });
  });
  
  app.listen(3000, () => {
    console.log("CONNECTED!");
  });
  