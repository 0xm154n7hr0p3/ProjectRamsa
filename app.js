const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
dotenv.config();
const port = process.env.PORT ;
const router = require("./route")
const path = require("path")
const cookieparser = require("cookie-parser")
const { engine } = require("express-handlebars")

// Configuration de la connexion à la base de données MySQL
const db= mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB

})
// Connexion à la base de données MySQL
db.connect((err)=>{
    if (err){
        console.log(err)
    }
    else {
        console.log("Mysql connected ")
    }
})

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieparser())

//utilisation 
app.engine("handlebars", engine({ extname:".hbs",
    defaultLayout: false,
    layoutsDir:"views"
}));
// Configuration du moteur de templates Handlebars HBS
app.use(express.static("public"))
app.set("views",path.join(__dirname,"views"))
app.set("view engine","hbs");


//routes
app.use("/",router)
app.use("/auth",router)

let server = app.listen(port, () => {
    console.log(`server is running on ${port}`)
})

module.exports= app;



