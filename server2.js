const express = require("express")
const app = express()
const mysql = require("mysql2/promise")

// parse application/json, för att hantera att man POSTar med JSON
const bodyParser = require("body-parser")

// Inställningar av servern.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

async function getDBConnnection() {
  // Här skapas ett databaskopplings-objekt med inställningar för att ansluta till servern och databasen.
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "första",
  })
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.get('/users', async function(req, res) {
  let connection = await getDBConnnection()
  let sql = `SELECT * FROM users`   
  let [results] = await connection.execute(sql)

  //res.json() skickar resultat som JSON till klienten
  res.json(results)
});


app.get('/users/:id', async function(req, res) {
  //kod här för att hantera anrop…
  let connection = await getDBConnnection()

  let sql = "SELECT * FROM users WHERE id = ?"
  let [results] = await connection.execute(sql, [req.params.id])
  res.json(results[0]) //returnerar första objektet i arrayen
});


/*
  app.post() hanterar en http request med POST-metoden.
*/

app.post('/users', async function(req, res) {
  //req.body innehåller det postade datat
   console.log(req.body)
 
   let connection = await getDBConnnection()
   let sql = `INSERT INTO users (username, password, name, email)
   VALUES (?, ?, ?, ?)`
 
   let [results] = await connection.execute(sql, [
     req.body.username,
     req.body.password,
     req.body.name,
     req.body.email
   ])
 
   //results innehåller metadata om vad som skapades i databasen
   console.log(results)
   res.json(results)
 });
 
 

const port = 3000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})