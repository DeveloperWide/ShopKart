if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override")
const session = require("express-session")
const flash = require("connect-flash")
const MongoStore = require("connect-mongo")
const dbUrl = `mongodb://127.0.0.1:27017/shopkart`;

let sessionOptions = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
    }),
    secret: "dafsdfasdfasd",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}

app.use(session(sessionOptions))
app.use(flash())
// Routes
const userAuthRoutes = require("./routes/userAuth")
const userAccountRoutes = require("./routes/userAccount")
const productRoutes = require("./routes/product");
const adminRoutes = require("./routes/admin");
const ExpressError = require("./utility/ExpressError");


// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Connect to db
main().then(() => {
    console.log(`Connected To DB`)
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


app.use(methodOverride("_method"))
app.use((req, res, next) => {
   res.locals.currUser = req.session.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
})
// Server static files
app.use(express.static(path.join(__dirname, "/public/")))

// Parse URLencoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get("/" , (req, res) => {
    res.redirect("/api/products")
})


app.use("/api/products/", productRoutes)
app.use("/admin/", adminRoutes)
// User auth
app.use("/api/auth/", userAuthRoutes);
// User Account
app.use("/api/user/", userAccountRoutes)

app.use((req, res, next) => {
    next(new ExpressError("Page Not Found" ,404))
})

app.use((err, req, res, next) => {
    let {message = "Error Ocurred" , statusCode=500} = err;
    res.status(statusCode).render("error.ejs" , {message})
})

app.listen(8080, () => {
    console.log(`Server is listing on PORT ${8080}`)
})