if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');

// Routes
const userRoutes = require("./routes/users")
const productRoutes = require("./routes/product")

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
  await mongoose.connect('mongodb://127.0.0.1:27017/shopkart');
}
// Server static files
app.use(express.static(path.join(__dirname , "/public/")))

// Parse URLencoded data
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use("/" , productRoutes)
app.use("/user/" , userRoutes)


app.listen(8080, () => {
    console.log(`Server is listing on PORT ${8080}`)
})