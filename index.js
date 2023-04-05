if(process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const Product = require('./models/Product');
const User = require('./models/User');

const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const flash = require('connect-flash');
const sessionflash = {
  secret: 'this is a flash session',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7*24*60*60*1000
  }
};

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/shopping-app";
const PORT = process.env.PORT || 5000;

// Product Routes
const productRouter = require('./routes/productRoutes');

// Review Routes
const reviewRouter = require('./routes/reviewRoutes');

// Auth Router
const authRouter = require('./routes/authRoutes');

const methodOverride = require('method-override');

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl)
.then(() => console.log("DB Connected"))
.catch((err) => console.log(err));

const app = express();
// const PORT = 3000;

app.use(session(sessionflash));
app.use(flash());
app.use(passport.authenticate('session'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
})

// Routers
app.use(productRouter); 
app.use(reviewRouter);
app.use(authRouter);

// Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/products', (req, res) => {
  res.render('./products/product');
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});