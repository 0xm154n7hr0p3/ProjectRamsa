const mysql = require("mysql");
// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB

});

exports.verifyToken = (req, res) => {
    const token = req.params.token;

    if (!token) {
        return res.status(400).render("login", { message: 'Token non fourni.' });
    }

    db.query('SELECT CIN FROM utilisateur WHERE jwt_token = ?', [token], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).render("login", { message: 'Une erreur s\'est produite lors de la vérification du jeton.' });
        }

        if (results.length === 0) {
            return res.status(404).render("login", { message: 'Le jeton n\'a pas été trouvé dans la base de données.' });
        }

        const CIN = results[0].CIN;
        db.query('UPDATE utilisateur SET is_verified = 1 WHERE CIN = ?', [CIN], (updateError) => {
            if (updateError) {
                console.log(updateError);
                return res.status(500).render("login", { message: 'Une erreur s\'est produite lors de la mise à jour du statut de vérification.' });
            }
            // Vous pouvez effectuer d'autres actions ici si nécessaire
            return res.status(200).render("login", { message: 'Jeton vérifié avec succès.' });
        });
    });
};
