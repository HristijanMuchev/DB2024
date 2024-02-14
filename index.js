const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/"));
const port = 3000;

const { Pool } = require("pg");

function getClient() {
  // //Remote db
  return new Pool({
    user: "db_202324z_va_prj_vbh_owner",
    host: "localhost",
    database: "db_202324z_va_prj_vbh",
    password: "14769c80a599",
    port: "9999",
  });

  // //Local db
  // return new Pool({
  //   user: "muchev",
  //   host: "localhost",
  //   database: "vbh",
  //   password: "muchev",
  //   port: "5432",
  // });
}

/**Pages */
// Index page
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Buy Book page
app.get("/buy/:id", async (req, res) => {
  res.sendFile(__dirname + "/buy-books.html");
});

/*Endpoints*/
// Get Books
app.get("/api/books", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  const client = getClient();
  await client.connect();

  const query = 'SELECT * from "Project"."book"';
  result = await client.query(query);
  res.send(result.rows);
});

// Register a customer
app.post("/api/register", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  const client = getClient();
  await client.connect();
  const query =
    'INSERT INTO "Project".customer (customerid, username, "password", firstname, lastname, email, address, phone) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';

  const customerId = Math.floor(Math.random() * 10000) + 1;
  await client.query(query, [
    customerId,
    req.body.username,
    req.body.password,
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.address,
    req.body.phone
  ]);
  res.send(
    `Customer ${req.body.firstname} ${req.body.lastname}, with email ${req.body.email} has been successfully registered`
  );
});

////////////////////////////////////
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
