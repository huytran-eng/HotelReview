require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync = require('./ultis/catchAsync')
const ExpressError = require('./ultis/expressErrors')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userRoutes = require('./routes/user')
const hotelsRoutes = require('./routes/hotels')
const reviewsRoutes = require('./routes/reviews')
const mongoSanitize = require('express-mongo-sanitize');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/hotel'
const MongoDBStore = require("connect-mongo")(session);


mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log(err)
    })

const store = new MongoDBStore({
    url: dbURL,
    secret: process.env.SECRET,
    touchAfter: 24 * 60 * 60
})
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '../public'));
app.use(mongoSanitize())

const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


app.use('/', userRoutes)
app.use('/hotels', hotelsRoutes);
app.use('/hotels/:id/reviews', reviewsRoutes)

app.get('/', (req, res) => {
    res.render('home')
});




app.all('*', (req, res, next) => {
    next(new ExpressError('Khong Tim Thay', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Oh No, Something Went Wrong!' } = err;
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Dang o port ${port}`)
})

