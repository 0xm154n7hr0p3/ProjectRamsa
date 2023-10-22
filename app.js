const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
dotenv.config();
const port = process.env.PORT ;
const router = require("./route")
const path = require("path")
const helmet = require('helmet');
const cookieparser = require("cookie-parser")
const { engine } = require("express-handlebars")
const MomentHandler = require("handlebars.moment");
const Handlebars = require("handlebars");
const hpp = require('hpp');
const xssMiddleware=require("./utils/xssMiddleware");
const rateLimit = require('express-rate-limit');



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

// Create a rate limiter middleware
const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 35, // limit each IP to 3 requests per windowMs
    message:'<h1>429 Too Many Requests</h1><br><hr><strong>Oops ! Vous avez dépassé la limite de fréquence. Veuillez réessayer plus tard.</strong>',
    headers: true,
  });

//middleware
app.use(express.json({ limit: '5kb' }));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieparser());
app.use( helmet({ contentSecurityPolicy: false, }) )
app.use(hpp());
app.use(xssMiddleware)
app.use(limiter)




//utilisation 
app.engine("handlebars", engine({ extname:".hbs",
    defaultLayout: false,
    layoutsDir:"views",
    helpers:{
        formatDate: function(datetime, format){
            return moment(datetime).format(format);
        }

    
    }
}));
// Configuration du moteur de templates Handlebars HBS
app.set("views",path.join(__dirname,"views"))
app.set("view engine","hbs");
app.use(express.static(path.join(__dirname, 'public')))



//routes
app.use("/",router)
app.use("/auth",router)

let server = app.listen(port, () => {
    console.log(`server is running on ${port}`)
})

module.exports= app;



