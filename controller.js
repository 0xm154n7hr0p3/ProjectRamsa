const express = require("express");
const app = require("./app");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { promisify } = require("util");
const { Console } = require("console");
const nodemailer = require('nodemailer');
const sendMailModule = require("./utils/SendMail")
const template= require("./templates/ActivateMail");
const DF=require("./utils/FormatDate")
const { start } = require("repl");
const validator = require('validator');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const createDOMPurify = require('dompurify');
const DOMPurify = createDOMPurify(window);

dotenv.config();

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});
//
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

// Fonction de connexion pour l'utilisateur
exports.login = async (req, res) => {
    
    // Récupération du CIN et du mot de passe depuis la requête
    const { CIN, mot_de_passe } = req.body;

    try {
        if (!CIN || !mot_de_passe) {
            // Vérification si le CIN ou le mot de passe est manquant
            res.status(400).render("login", {
                message: "Veuillez fournir le CIN et le mot de passe"
            });
        } else {
            try{
            // Vérification des informations d'identification dans la base de données
            db.query("SELECT * FROM utilisateur WHERE CIN = ?", [CIN], async (err, results) => {
                if (!results || results.length === 0 || !(await bcrypt.compare(mot_de_passe, results[0].mot_de_passe))) {
                    res.status(400).render("login", {
                        message: "CIN ou mot de passe invalide"
                    });
                }else if(!results[0].is_verified) {
                    res.status(400).render("login", {
                        message: "Verifier Votre Compte!"
                    });
                }
                else {
                    // Création du token JWT pour l'utilisateur connecté
                    const CIN_id = results[0].CIN;
                    const type = results[0].type;
                    const token = jwt.sign({ CIN_id, type }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES
                    });

                    // Configuration des options du cookie contenant le token JWT
                    const CookieOpt = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                        secure: true
                    };

                    // Définition du cookie contenant le token JWT
                    res.cookie("JWT", token, CookieOpt);

                    // Redirection vers la page appropriée en fonction du type d'utilisateur
                    if (type == "admin") {
                        res.status(200).redirect("/admin");
                    }
                    if (type == "user") {
                        res.status(200).redirect("/user");
                    }
                }
            });
        }
        catch(err){
            res.status(400).redirect("/login")
        }}
       
    } catch (err) {
        console.log(err);
    }
};

// Middleware pour vérifier si l'utilisateur est connecté
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.JWT) {
        try {
            let decoded = await promisify(jwt.verify)(req.cookies.JWT, process.env.JWT_SECRET);

            try {
                const results_isLoggedIn = await new Promise((resolve, reject) => {
                    db.query("SELECT * from utilisateur where CIN = ?", [decoded.CIN_id], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });

                if (!results_isLoggedIn || results_isLoggedIn.length === 0) {
                    return next();
                } else {

                    req.user = results_isLoggedIn[0];
                    return next();
                }
            } catch (error) {
                console.log(error);
                return next();
            }
        } catch (error) {
            console.log(error);
            return next();
        }
    }
    next();
};

// Fonction pour créer une nouvelle demande par l'utilisateur
exports.postUser = async (req, res) => {
    // Récupération des données du formulaire pour créer une demande
try{    
    let { Ecole ,Service, Assurance_ouinon, Assurance_compagnie } = req.body;
    const AssuranceINT = Assurance_ouinon * 1;
    const EcoleINT= Ecole*1
    const date_de_demand= new Date()

    console.log({ Ecole ,Service, Assurance_ouinon, Assurance_compagnie })

    if (!date_de_demand ||  !Service || !Assurance_ouinon || !Assurance_compagnie || !Ecole) {
        // Vérification si tous les champs du formulaire sont remplis
        res.status(400).render("user2", {
            message: "Veuillez remplir tout le formulaire !"
        });
    } else {
        


        // Insertion des données de la demande dans la base de données
        db.query("INSERT into demandes SET ?", [{ date_de_demande: date_de_demand,  Assurance: AssuranceINT, compagnie_assurance: Assurance_compagnie, Service, etat_de_demande: "instance", CIN:req.user.CIN ,id_ecole: EcoleINT }], async (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).render("user2", {
                    message: "Le formulaire n'est pas soumis, réessayez plus tard !"
                });
            } else {

                res.status(200).render("user2", {
                    message: "Le formulaire est soumis !"
                });
            }
        });
    }}
    catch(error){
        console.log(error);
                res.status(500).render("user2", {
                    message: "Le formulaire n'est pas soumis, réessayez plus tard !"
                });

    }
};

// Middleware pour récupérer les demandes associées à un utilisateur
exports.FetchUser = async (req, res, next) => {
    try {
        const results_FetchUser = await new Promise((resolve, reject) => {
            db.query("SELECT * from demandes where CIN = ?", [req.user.CIN], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (!results_FetchUser || results_FetchUser.length === 0) {
            return next();
        } else {
          
            try {
                //table ecole

                const results_FetchUser_Ecole = await new Promise((resolve, reject) => {
                    db.query("SELECT * from ecole", (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });  
                // construire une liste qui contient les id_ecoles des demands instance et 
                const id_ecoles = results_FetchUser.map((row) => row.id_ecole);
                //construire un object key:value d'apres la table ecolee
                const resultsObject = results_FetchUser_Ecole.reduce((acc, row) => {
                    acc[row.id_ecole] = row.libelle;
                    return acc;
                  }, {});
                // obtenir les nom des des ecole d apres leurs id  
                const Nom_Ecole = id_ecoles.map((id) => resultsObject[id]); 
                
                
                // Attribuez nom_ecole à chaque objet results_FetchUser en fonction de son id_ecole

                results_FetchUser.forEach((user, index) => {
                    user.Nom_Ecole = Nom_Ecole[index];
                });
                
                
                for (const item of results_FetchUser) {
                    item.date_de_demande = DF.DateFormat(item.date_de_demande);
                    item.date_de_debut = DF.DateFormat(item.date_de_debut);
                    item.date_de_fin = DF.DateFormat(item.date_de_fin);

                }
                req.FetchUser = results_FetchUser;
                return next()
            } catch (error) {
                console.log(error)
                return next()
                
            }
            return next();
        }
    } catch (error) {
        console.log(error);
        return next();
    }
    next();
};

// Middleware pour récupérer les demandes en attente de validation (pour l'administrateur)
exports.FetchDemande = async (req, res, next) => {
    try {
        const results_FetchDemande = await new Promise((resolve, reject) => {
            db.query("SELECT * from demandes where etat_de_demande = 'instance' ", (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        
        if (!results_FetchDemande || results_FetchDemande.length === 0) {
            return next();
        } else {
            try {
                //table ecole

                const results_FetchUser_Ecole = await new Promise((resolve, reject) => {
                    db.query("SELECT * from ecole", (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });  
                // construire une liste qui contient les id_ecoles des demands instance et 
                const id_ecoles = results_FetchDemande.map((row) => row.id_ecole);
                //construire un object key:value d'apres la table ecolee
                const resultsObject = results_FetchUser_Ecole.reduce((acc, row) => {
                    acc[row.id_ecole] = row.libelle;
                    return acc;
                  }, {});
                // obtenir les nom des des ecole d apres leurs id  
                const Nom_Ecole = id_ecoles.map((id) => resultsObject[id]); 
                
                
                // Attribuez nom_ecole à chaque objet results_FetchUser en fonction de son id_ecole

                results_FetchDemande.forEach((user, index) => {
                    user.Nom_Ecole = Nom_Ecole[index];
                });
                
               
                UserCin =results_FetchDemande.map((value)=>value.CIN)
                
                let UserInfo= []
                for(let i =0 ; i<UserCin.length ; i++){
                let results_FetchDemande_user = await new Promise((resolve, reject) => {
                    db.query("SELECT nom,prenom,adress,Telephone,email from utilisateur where CIN = ?",[UserCin[i]], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                })
                UserInfo.push(results_FetchDemande_user)
            }
                results_FetchDemande.forEach((user, index) => {
                    user.nom = UserInfo[index][0].nom;
                    user.prenom = UserInfo[index][0].prenom;
                    user.adress = UserInfo[index][0].adress;
                    user.Telephone = UserInfo[index][0].Telephone;
                    user.email = UserInfo[index][0].email;
                });

                for (const item of results_FetchDemande) {
                    item.date_de_demande = DF.DateFormat(item.date_de_demande);}

                req.FetchDemande = results_FetchDemande;
                return next()
            } catch (error) {
                console.log(error)
                return next()
                
            }
            
            return next();
        }
    } catch (error) {
        console.log(error);
        return next();
    }
    next();
};

// Fonction pour fournir l'avis favorable ou defavorable sur la demande par l'administrateur
exports.postAdmin = async (req, res) => {
    try {
        const { id_demande, start_date, end_date, refuse_reaseon } = req.body;

        let status;
        if (!refuse_reaseon || refuse_reaseon.length === 0) {
            status = "validé";
        } else {
            status = "refusé";
        }

        // Mise à jour du statut de la demande (validée ou refusée) dans la base de données
        db.query("UPDATE demandes SET ? where id_demande = ?", [{ date_de_debut: start_date, date_de_fin: end_date, etat_de_demande: status , motif_de_refus:refuse_reaseon }, id_demande], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).render("admin", {
                    message: "Le formulaire n'est pas soumis, réessayez plus tard ! :("
                });
            } else {
                
                res.status(200).render("admin", {
                    message: "Formulaire est soumis ! :)"
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// Fonction pour se déconnecter
exports.logout = async (req, res) => {
    // Suppression du cookie contenant le token JWT
    res.cookie("JWT", "", {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
        secure: true
    });
    res.status(302).redirect("/login");
};

exports.chart=async(req,res,next)=>{
try {
    let startDate = "2023-01-01";
    let endDate= "2023-12-12"; 
    console.log(req.query)
    if (req.query.start_date && req.query.end_date){
        startDate=req.query.start_date
        endDate=req.query.end_date
    }
    if (validator.isDate(startDate)|| validator.isDate(endDate)){

    //PIE CHART DATA (les taux de demandes accepter / refuser/ pas repondu)

    const results_chart = await new Promise((resolve, reject) => {
        db.query("SELECT etat_de_demande, COUNT(*) AS count FROM demandes WHERE date_de_demande BETWEEN ? AND ? GROUP BY etat_de_demande",[startDate, endDate],  (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
    console.log(results_chart)
    // Calculer le nombre total de demandes
    const totalCount = results_chart.reduce((total, row) => total + row.count, 0);
    // Calculer les pourcentages pour chaque valeur de "etat_de_demande"
    results_chart.forEach(row => {
        row.percentage = ((row.count / totalCount) * 100).toFixed(2);
    });
    req.results_chart=results_chart



    // VERTICAL BAR DATA (les taux des ecoles dans les demands)
    const results_chart2 = await new Promise((resolve, reject) => {
        db.query("SELECT id_ecole, COUNT(*) AS count FROM demandes WHERE date_de_demande BETWEEN ? AND ?  GROUP BY id_ecole ",[startDate, endDate], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
    //table ecole

    const results_FetchUser_Ecole = await new Promise((resolve, reject) => {
        db.query("SELECT * from ecole", (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });  
    // construire une liste qui contient les id_ecoles des demands instance et 
    const id_ecoles = results_chart2.map((row) => row.id_ecole);
    //construire un object key:value d'apres la table ecolee
    const resultsObject = results_FetchUser_Ecole.reduce((acc, row) => {
        acc[row.id_ecole] = row.libelle;
        return acc;
      }, {});
    // obtenir les nom des des ecole d apres leurs id  
    const Nom_Ecole = id_ecoles.map((id) => resultsObject[id]); 
    const totalCount2 = results_chart2.reduce((total, row) => total + row.count, 0);
    const resultsArray = results_chart2.map((item) => {
        const id_ecole = item.id_ecole;
        const nom_ecole = resultsObject[id_ecole];
        const countt = item.count/totalCount2 * 100;
        return { nom_ecole, countt };
    });
      
    
    
    req.results_chart2=resultsArray
    
    }
  

} catch (error) {
    console.log(error)
    res.status(500).render("statistic", {
        message: "Erreur interne du serveur :("
    });

    return next()
}
    next()
}

exports.register = async (req, res) => {
    console.log(req.body);
  
   const { CIN, Prenom, nom, Email, adress, Telephone, mot_de_passe, mot_de_passe_confirme } = req.body;


    if (!CIN || !Prenom || !nom || !Email || !adress || !Telephone || !mot_de_passe || !mot_de_passe_confirme) {
        res.status(400).render("register", {
            message: "Veuillez remplir tout le formulaire !"
        });
    } 
    const errors = [];
    if (!validator.isEmail(Email)) {
        errors.push('Adresse e-mail invalide.');
      }
    
      // Validate phone number
      if (!validator.isMobilePhone(Telephone, 'any', { strictMode: false })) {
        errors.push('Numéro de téléphone invalide.');
      }
    
      // Validate password (example: minimum length of 8 characters)
      if (!validator.isLength(mot_de_passe, { min: 8 })) {
        errors.push('Le mot de passe doit comporter au moins 8 caractères.');
      }
    
      // Add more validation checks as needed for other variables
    
     
      // Check if there are any validation errors
      if (errors.length > 0) {
        return res.status(400).render("register", {
          message: "Veuillez remplir correctement tous les champs du formulaire !",
          errors
        });
       
      }
    
    else {
        try {
            db.query('SELECT email,CIN FROM utilisateur WHERE email = ? OR CIN=?', [Email, CIN], async (error, results) => {
                if (error) {
                    console.log(error);
                }

                if (results.length > 0) {
                    return res.render('register', {
                        message: 'Email ou CIN est déjà utilisé'
                    });
                } else if (mot_de_passe !== mot_de_passe_confirme) {
                    return res.render('register', {
                        message: 'Les mots de passe ne correspondent pas'
                    });
                }

                let hashedPassword = await bcrypt.hash(mot_de_passe, process.env.BCRYPT_SECRET);
                // Création du token JWT pour l'utilisateur connecté
                const CIN_id = CIN;
                const type = "user";
                const token = jwt.sign({ CIN_id, type }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                });

                try {
                    await db.query('INSERT INTO utilisateur SET ?', { nom: nom, prenom: Prenom, adress: adress, Telephone: Telephone, email: Email, mot_de_passe: hashedPassword, CIN: CIN, type: "user", jwt_token: token });
                    
                    const url = `http://localhost:8080/verify/${token}`;
                    
                    await sendMailModule.sendMail(Email, url,template);

                    return res.render('register', {
                        message: 'Un lien de vérification a été envoyé à votre adresse e-mail.'
                    });
                } catch (error) {
                    console.log(error);
                    return res.render('register', {
                        message: 'Une erreur s\'est produite lors de l\'enregistrement.'
                    });
                }
            });
        } catch (error) {
            console.log(error);
            return res.render('register', {
                message: 'Une erreur s\'est produite.'
            });
        }
    }
};
