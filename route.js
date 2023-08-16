const express = require("express");
const router = express.Router();
const trimrequest = require("trim-request");
const AUTHcontroller = require("./controller");
const { route } = require("./app");
const error400="<h1>403 Forbidden</h1><br><hr><strong>Oops! Vous n'êtes pas autorisé à accéder à cette page.</strong>"
const verify=require("./utils/VerifyToken")

// Apply trimrequest middleware globally for all routes
router.use(trimrequest.all);

// Routes API



//requetes POST
router.post("/login", AUTHcontroller.login);
router.post("/user",AUTHcontroller.isLoggedIn,AUTHcontroller.postUser);
router.post("/admin",AUTHcontroller.postAdmin);
router.post("/register",AUTHcontroller.register)



//requetes GET

router.get("/admin/statistiques",AUTHcontroller.isLoggedIn,AUTHcontroller.chart,  AUTHcontroller.FetchDemande,(req, res)=>{
  if (!req.user || req.user.length === 0 ||!req.user.is_verified|| req.user.type !== "admin") {
    return res.status(403).send(error400);
  }
  nom = req.user.nom
  prenom= req.user.prenom
 
  res.render("statistic",{
    demandeData: JSON.stringify(req.results_chart),
    ecoleData: JSON.stringify(req.results_chart2),
    FetchDemande:req.FetchDemande,
    nom,
    prenom
  })
})

router.get("/admin", AUTHcontroller.isLoggedIn, AUTHcontroller.FetchDemande, (req, res) => {
  if (!req.user || req.user.length === 0||!req.user.is_verified || req.user.type !== "admin") {
    return res.status(403).send(error400);
  }
  nom = req.user.nom
  prenom= req.user.prenom
  
  res.render("admin",{
    FetchDemande:req.FetchDemande,
    nom,
    prenom
  })
});

router.get("/user", AUTHcontroller.isLoggedIn,AUTHcontroller.FetchUser, (req, res) => {
  if (!req.user || req.user.length === 0 ||!req.user.is_verified || req.user.type !== "user") {
    return res.status(403).send(error400);
  }
  nom = req.user.nom
  prenom= req.user.prenom
  res.render("user2",{
    FetchUser: req.FetchUser,
    nom,
    prenom
  });
  
});

router.get("/register",AUTHcontroller.isLoggedIn,(req,res)=>{
  if (req.user) {
    switch (req.user.type) {
      case "admin":
        return res.status(302).redirect("/admin");
      case "user":
        return res.status(302).redirect("/user");
      default:
        break;
    }
  }

res.status(200).render("register");
})

router.get("/login", AUTHcontroller.isLoggedIn, (req, res) => {
  if (req.user) {
    switch (req.user.type) {
      case "admin":
        return res.status(302).redirect("/admin");
      case "user":
        return res.status(302).redirect("/user");
      default:
        break;
    }
  }
  res.status(200).render("login");
});
router.get("/logout",AUTHcontroller.logout)
router.get("/",(req,res)=>{
  res.status(302).redirect("/login")
})

router.get("/verify/:token",verify.verifyToken)

router.all("*", (req, res) => {
  res.status(404).send("<h1>404 Not Found</h1><br><hr><strong>Oops! The requested resource does not exist.</strong>");
});



module.exports = router