const express = require('express')
const bodyParser = require('body-parser')
const mysql = require("mysql"); 
const bcrypt = require('bcrypt');
var cors = require('cors');
const server = express();
server.use(bodyParser.json());

server.use(cors());    // cross origin


const fs = require('fs');
const multer = require('multer');



 
const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12656362",
    password: "D4T7p6LmHr",
    database: "sql12656362",
});
db.connect(function (error) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      console.log("successfully Connected to DB");
    }
  });
  const ipAddress = '192.168.0.104'
  server.listen(3306, function check(error) {
    if (error) 
    {
    console.log("Error....dddd!!!!");
    }
    else 
    {
        console.log("Started....!!!! 8085");
    }
});


//================================================== QUERY ================================

server.use('/images', express.static('images'));          //this line use only get images from server

const storage = multer.diskStorage({
  // destination: 'uploads/', // Upload directory
  // filename: function (req, file, callback) {
  //   // Generate a unique filename for the uploaded file
  //   callback(null, file.originalname);
  // },
}); 

const upload = multer({ storage: storage });
// insert records
 
server.post("/product/add",upload.single('image'), (req, res) => {
  
  const uploadedFilePath = req.file.path;
  const duplicateFileName = req.file.originalname;
  const duplicateFilePath = `images/${duplicateFileName}`;

  // Create a duplicate of the uploaded image
  fs.copyFile(uploadedFilePath, duplicateFilePath, (err) => {
    if (err) {
      console.error(err);
      return res.send({ status: false, message:'Error creating a duplicate image'});
    }else{
      // console.log('Duplicate image created:', duplicateFileName); 
      // res.json({ filename: duplicateFileName });
 
      let details = {
        cid: req.body.cid,
        pname: req.body.pname,
        packsize: req.body.packsize,
        mrp: req.body.mrp,
        image:duplicateFileName,
        status: req.body.status
      };
      console.log(details)
      let sql = "INSERT INTO product SET ?";
      db.query(sql, details, (error) => {
       
          if (error) {
              res. send({ status: false, message: "product creation failed" });
          } else {
              res.send({ status: true, message: "product created successfully" });
              return;
          }
      }); 
    }
  });
       
});


server.post("/category/add",  (req, res) => {
  let details = {
    cname: req.body.cname,
    description: req.body.description,
    status: req.body.status
  };
  
  let sql = "INSERT INTO category SET ?";
  db.query(sql, details, (error) => {
   
      if (error) {
          res. send({ status: false, message: "product creation failed" });
      } else {
          res.send({ status: true, message: "product created successfully" });
          return;
      }
  }); 
})




//view the Records
server.get("/product/getall", (req, res) => {
    var sql = "SELECT * FROM product";
    db.query(sql, function (error, result) {
      console.log("data"+result)
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });

  //all category
server.get("/category/getall", (req, res) => {
    var sql = "SELECT * FROM category";
    db.query(sql, function (error, result) { 
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });
//Search the Records
server.get("/product/get/:id", (req, res) => {
    var employeeid = req.params.id;
    var sql = "SELECT * FROM employee WHERE id=" + employeeid;
    db.query(sql, function (error, result) {
      if (error) {
        console.log("Error Connecting to DB");
      } else {
        res.send({ status: true, data: result });
      }
    });
  });
  

 
//Update the Records
server.put("/product/update/:id", (req, res) => {
  
  let sql = "UPDATE product SET pname='" +req.body.pname +
  "', cid='" + req.body.cid +
  "', packsize='" +  req.body.packsize + 
  "', mrp='" + req.body.mrp + 
  "',image='" + req.body.image +
  "',status='" + req.body.status +
  "'  WHERE id=" + req.params.id;

let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, messemail: "product Updated Failed" });
    } else {
      res.send({ status: true, messemail: "product Updated successfully" });
    }
}); 

  });


  
//category Update the Records
server.put("/category/update/:id", (req, res) => {
  
  let sql = "UPDATE category SET cname='" +req.body.cname +
  "',description='" + req.body.description +
  "',status='" + req.body.status +
  "'  WHERE id=" + req.params.id;

let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, messemail: "category Updated Failed" });
    } else {
      res.send({ status: true, messemail: "category Updated successfully" });
    }
}); 

  });





server.put("/product/updateWithImg/:id",upload.single('image'), (req, res) =>
 { 
      const uploadedFilePath = req.file.path;
        const duplicateFileName = req.file.originalname;
        const duplicateFilePath = `images/${duplicateFileName}`;

        // Create a duplicate of the uploaded image
        fs.copyFile(uploadedFilePath, duplicateFilePath, (err) => {
          if (err) {
            console.error(err);
            return res.send({ status: false, message:'Error creating a duplicate image'});
          }else{
            
            let sql = "UPDATE product SET pname='" +req.body.pname +
              "', cid='" + req.body.cid +
              "', packsize='" +  req.body.packsize + 
              "', mrp='" + req.body.mrp + 
              "',image='" + duplicateFileName +
              "',status='" + req.body.status +
              "'  WHERE id=" + req.params.id;
          
            let a = db.query(sql, (error, result) => {
                if (error) {
                  res.send({ status: false, messemail: "product Updated Failed" });
                } else {
                  res.send({ status: true, messemail: "product Updated successfully" });
                }
            }); 
          }
      }); 
  });


  //Delete the Records
  server.delete("/product/delete/:id", (req, res) => {
    console.log('delete called')
    let sql = "DELETE FROM product WHERE id=" + req.params.id + "";
    let query = db.query(sql, (error) => {
      if (error) {
        res.send({ status: false, messemail: "product Deleted Failed" });
      } else {
        res.send({ status: true, messemail: "product Deleted successfully" });
      }
    });
  });


  //category delete
  server.delete("/category/delete/:id", (req, res) => {
    console.log('delete called')
    let sql = "DELETE FROM category WHERE id=" + req.params.id + "";
    let query = db.query(sql, (error) => {
      if (error) {
        res.send({ status: false, messemail: "category Deleted Failed" });
      } else {
        res.send({ status: true, messemail: "category Deleted successfully" });
      }
    });
  });


  
// login auth
  
server.post("/admin/login", (req, res) => {
  const email = req.body.pname;
  const password = req.body.packsize;
  // Retrieve the user from the database based on their email
  let sql = "SELECT * FROM admin WHERE email = ? && password=?";
 
  db.query(sql, [email, password], (error, results) => {
      if (error) {
          res.status(500).send({ status: false, message: "Error connecting to the database" });
      } else {
         
          if (results.length === 0) {
              res. send({ status: false, message: "User not found" });
          } else {  
                  res.send({ status: true, message: "Success" });
         }
      }
  });
});




 

