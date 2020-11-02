const fs = require('fs');

module.exports = {
    addPatientPage: (req, res) => {
        res.render('add-patient.ejs', {
            title: "Welcome to Electronic Media Record | Add a new patient"
            ,message: ''
        });
    },
    addPatient: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let address = req.body.address;
        let age = req.body.age;
        let sex = req.body.sex;
        let laboratory_result = req.body.laboratory_result;
        let immunization_status = req.body.immunization_status;
        let medication = req.body.medication;
        let allergies = req.body.allergies;
        let medical_history = req.body.medical_history;
        let notes = req.body.notes;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let careprovider_id = req.body.careprovider_id;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

    
      let usernameQuery = "SELECT * FROM `patientdetails` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-patient.ejs', {
                    message,
                    title: "Welcome to Socka | Add a new player"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the patient's details to the database
                        
                            let query = "INSERT INTO `patientdetails` (first_name, last_name,address,age,sex,laboratory_result,immunization_status,medication,allergies,medical_history,notes, position, number, image, user_name , careprovider_id) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + address + "', '" + age + "', '" + sex + "', '" + laboratory_result + "', '" + immunization_status + "', '" + medication + "', '" + allergies + "', '" + medical_history + "', '" + notes + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "', '" + careprovider_id + "')";
                            
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-patient.ejs', {
                        message,
                        title: "Welcome to Electronic Media Record | Add a new patient"
                    });
                }
            }
        });
    },
    editPatientPage: (req, res) => {
        let playerId = req.params.id;
        
        let query = "SELECT * FROM `patientdetails` WHERE id = '" + playerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-patient.ejs', {
                title: "Edit  Player"
                ,player: result[0]
                ,message: ''
            });
        });
    },
    editPatient: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        //let position = req.body.position;
        //let number = req.body.number;
        let address = req.body.address;
        let age = req.body.age;
        let sex = req.body.sex;
        let medication = req.body.medication;
        let notes = req.body.notes;


        
        let query = "UPDATE `patientdetails` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `address` = '" + address + "', `age` = '" + age + "', `sex` = '" + sex + "', `medication` = '" + medication + "', `notes` = '" + notes + "' WHERE `players`.`id` = '" + playerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            res.redirect('/');
        });
    },
    deletePatient: (req, res) => {
        let playerId = req.params.id;
        
        let getImageQuery = 'SELECT image from `patientdetails` WHERE id = "' + playerId + '"';
        
        let deleteUserQuery = 'DELETE FROM patientdetails WHERE id = "' + playerId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};