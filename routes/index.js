module.exports = {
    getHomePage: (req, res) => {
       //Get all patients
        let query = "SELECT * FROM `patientdetails` ORDER BY id ASC"; 

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to Electronic Media Record | View Patients"
                ,players: result
            });
        });
    },
};