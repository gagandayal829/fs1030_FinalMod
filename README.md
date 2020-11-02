

# FS1030

Credits: Atauba Prince, https://dev.to/achowba/build-a-simple-app-using-node-js-and-mysql-19me



### We will run the app in the last portion of this Readme file after executing the scripts on the database side.



## Commands

Clone this repo

```
git clone https://github.com/gagandayal829/fs1030_FinalMod.git
```


Install the dependencies

```
npm install express express-fileupload body-parser mysql ejs req-flash --save
```

```
npm install express-session
```



Install nodemon globally

```
npm install nodemon -g
```




## MYSQL Script



Creating careprovider table

```
CREATE TABLE careproviderdetails(
`id` int(5) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`specialization` varchar(255) NOT NULL,
`address` varchar(255) NOT NULL,
`consultation_fee` int(11) NOT NULL,
PRIMARY KEY(id)
)
```

Inserting Values in careproviderdetails table

```
INSERT INTO careproviderdetails(
name,
specialization,
address,
consultation_fee) 
VALUES
('Sunil Chauhan','General Physician','Delhi','600'),
('Amitabh Khanna','Diabetologist','Dwarka Delhi','800'),
('Yuvraj Arora','Physician','Lajpat Delhi','650'),
('Virander Kumar','Internal Medicine','Delhi','900'),
('Sharad Srivastava','General Practitioner','Delhi','600');
```

Creating PatientDetails table

```
create table patientdetails(
`id` int(5) NOT NULL AUTO_INCREMENT,	
`first_name` varchar(255) NOT NULL ,
`last_name` varchar(255) NOT NULL,
`address` varchar(255) NOT NULL,
`age` int(11) NOT NULL,
`sex` varchar(255) NOT NULL ,
`laboratory_result` varchar(255) NOT NULL,
`immunization_status` varchar(255) NOT NULL,
`medication` varchar(255) NOT NULL,
`allergies` varchar(255) NOT NULL,
`medical_history` varchar(255) NOT NULL,
`notes` varchar(255) NOT NULL,
`position` varchar(255) NOT NULL,
`number` int(11) NOT NULL,
`image` varchar(255) NOT NULL,
`user_name` varchar(20) NOT NULL,
careprovider_id int(5),
primary key(id),
FOREIGN KEY(careprovider_id) REFERENCES careproviderdetails(id)
)
```



ADDING Revision history to your tables to track update changes

```
CREATE TABLE emrdb.data_history LIKE emrdb.patientdetails;
```

```
ALTER TABLE emrdb.data_history MODIFY COLUMN id int(11) NOT NULL, 
   DROP PRIMARY KEY, ENGINE = MyISAM, ADD action VARCHAR(8) DEFAULT 'insert' FIRST, 
   ADD revision INT(6) NOT NULL AUTO_INCREMENT AFTER action,
   ADD dt_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER revision,
   ADD PRIMARY KEY (id, revision);
```



Creating triggers

Running the drop command below is optional

```
DROP TRIGGER IF EXISTS emrdb.data__ai;
DROP TRIGGER IF EXISTS emrdb.data__au;
DROP TRIGGER IF EXISTS emrdb.data__bd;
```

```
CREATE TRIGGER emrdb.data__ai AFTER INSERT ON emrdb.patientdetails FOR EACH ROW
    INSERT INTO emrdb.data_history SELECT 'insert', NULL, NOW(), d.* 
    FROM emrdb.patientdetails AS d WHERE d.id = NEW.id;

CREATE TRIGGER emrdb.data__au AFTER UPDATE ON emrdb.patientdetails FOR EACH ROW
    INSERT INTO emrdb.data_history SELECT 'update', NULL, NOW(), d.*
    FROM emrdb.patientdetails AS d WHERE d.id = NEW.id;

CREATE TRIGGER emrdb.data__bd BEFORE DELETE ON emrdb.patientdetails FOR EACH ROW
    INSERT INTO emrdb.data_history SELECT 'delete', NULL, NOW(), d.* 
    FROM emrdb.patientdetails AS d WHERE d.id = OLD.id;  

```

Testing the history table by inserting,updating a row in patientdetails

```
INSERT INTO patientdetails (
first_name,
last_name,
address,
age,
sex,
laboratory_result,
immunization_status,
medication,
allergies,
medical_history,
notes,
position,
number,
image,
user_name)
values('gagan','dayal','delhi','28','male','lab','immune','rosu','none','history','notes','position','1','image','gd')
```

UPDATE Command

```
UPDATE patientdetails 
SET first_name = 'Gagandeep'
WHERE id = '1'
```

Result

```
action|revision|dt_datetime        |id|first_name
insert|       1|2020-11-01 23:44:35| 1|gagan 
update|       2|2020-11-01 23:53:29| 1|Gagandeep
```

Creating a SUPER Admin user that has access to careprovider and Patient details table 

```
CREATE USER 'superadmin'@'localhost' IDENTIFIED BY 'superadmin';
```

Super Admin is now created but it does not have access to any tables or views

```
GRANT ALL PRIVILEGES ON emrdb.* TO 'superadmin'@'localhost';
```

Now when you login as a superadmin in your DBeaver/workbench , the db 'emrdb' will be displayed .



Creating a dummy CareProvider user from the list of careproviders mentioned in the table 'careproviderdetails'

```
CREATE USER 'sunilchauhan'@'localhost' IDENTIFIED BY '';
```

Now sunil Chauhan careprovider is created and we want him to have SELECT,INSERT,UPDATE access on the patientdetails table

```
GRANT SELECT,INSERT,UPDATE ON emrdb.patientdetails TO 'sunilchauhan'@'localhost';
```

NOTE : Only superadmin can have delete rights.

Trying the Update command with Careprovider : sunilchauhan id

```
You need to reconnect to your SQL DB as the user 'sunilchauhan' and then run the update command below. 
```



```
UPDATE patientdetails 
SET
first_name = 'Manleen'
WHERE id = '8'
```

```
THis command gets executed as we have given Update right to sunilchauhan ID.
```



Trying the DELETE statement with SunilChauhan to verify if he is able to delete any record

```
DELETE command denied to user 'sunilchauhan'@'localhost' for table 'patientdetails'
```

Result

```
DELETE command denied to user 'sunilchauhan'@'localhost' for table 'patientdetails'
```

Creating a database which holds username & password for our EMR application

```
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES (1, 'superadmin', 'superadmin', 'super@admin.com');

ALTER TABLE `accounts` ADD PRIMARY KEY (`id`);
ALTER TABLE `accounts` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
```



Start the script by 

```
node app.js
```


Open the browser and browse at http://localhost:5000

