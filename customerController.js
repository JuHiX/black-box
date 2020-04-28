'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password : '',
  port : 3308, // <-- käytä oikeaa porttia
  database : 'asiakas' // <-- jos tietokannalla muu nimi niin muuta se tähän
});

module.exports = 
{
    fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error); 
          res.send({"status": 500, "error": error, "response": null}); 
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.send(results);
        }
    });

    },

    fetchAll: function(req, res){
      var sql;
      if (Object.keys(req.query).length == 0) {
        sql = 'SELECT * FROM asiakas WHERE 1=1'; // Tehtävä 45
      } else {
        sql = 'SELECT * FROM asiakas WHERE 1=1';
        for (var x in req.query) {
          sql = sql + " AND " + x + " like '" + req.query[x] + "%'"; // Tehtävä 46
        }
      }
      connection.query(sql, function(error, results, fields) {
        if (error) {
          console.log("Virhe haettaessa dataa asiakas-taulusta, syy: " + error);
          res.send({"status": 500, "error": error, "response": null});
        } else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.send(results);
        }
      })
    },

    create: function(req, res){
      console.log("Body = " + JSON.stringify(req.body));
      var sql = "INSERT INTO asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) " + // Tehtävä 48
      "VALUES ('" + req.body.nimi + "', '" + req.body.osoite + "', '" + req.body.postinro + "', '" +
      req.body.postitmp + "', '" + new Date().toJSON() + "', '" + req.body.asty_avain + "')";
      connection.query(sql, function(error, results, fields){
        if ( error ){
          console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
          res.send({"status": 500, "error": error, "response": null}); 
        }
        else
        {
          results.message = "Uusi asiakas luotiin onnistuneesti";
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 201;
          res.send({ "status": 201, "error": null, "response": results });
        }
      })  
    },
}
