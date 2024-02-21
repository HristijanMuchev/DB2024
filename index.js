const express = require("express");
const cors = require("cors");
const app = express();

const { Pool } = require("pg");

app.use(express.json());
app.use(express.static(__dirname + "/"));
app.use(cors());

const port = 3000;

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
  res.setHeader("Access-Control-Allow-Origin", "*");
  const client = getClient();
  await client.connect();

  const query = 'SELECT * from "Project"."book"';
  const result = await client.query(query);
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
    req.body.phone,
  ]);
  res.send(
    `Customer ${req.body.firstname} ${req.body.lastname}, with email ${req.body.email} has been successfully registered`
  );
});

// Execute an order
app.post("/api/order", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  const client = getClient();
  await client.connect();

  console.log('Request body', req.body);

  // Get the customer from db
  const customerQuery =
    'SELECT * FROM "Project".customer WHERE firstname = $1 and lastname = $2';
  const customerQueryResult = await client.query(customerQuery, [
    req.body.name,
    req.body.surname,
  ]);

  const customerId = customerQueryResult.rows[0].customerid;
  console.log('customerId', customerId);

  // Get the Book from db
  const bookQuery = 'SELECT * FROM "Project".book WHERE bookid = $1';
  const bookQueryResult = await client.query(bookQuery, [req.body.bookid]);
  const book = bookQueryResult.rows[0];
  console.log('book', book);

  // Generate a new cart for the user (return cartid)
  const cartId = Math.floor(Math.random() * 10000) + 1;
  const cartQuery =
    'INSERT INTO "Project".cart (cartid, quantity) VALUES($1, $2) RETURNING cartid';
  const cartQueryResult = await client.query(cartQuery, [
    cartId,
    req.body.Quantity,
  ]);
  // console.log('cartQueryResult', cartQueryResult);

  // Populate the MN table CartCustomer
  const cartCustomerQuery =
    'INSERT INTO "Project".cartcustomer (cartid, customerid) VALUES($1, $2)';
  const cartCustomerQueryResult = await client.query(cartCustomerQuery, [cartId, customerId]);
  // console.log('cartCustomerQueryResult', cartCustomerQueryResult);

  // Get the order data from the request
  const orderId = Math.floor(Math.random() * 10000) + 1;
  const orderQuery =
    'INSERT INTO "Project".ordertable (orderid, orderdate, totalamount) VALUES($1, $2, $3) returning totalamount';
  const date = new Date(Date.now()).toISOString().split('T')[0];

  const totalAmount = parseFloat(book.price) * parseInt(req.body.Quantity);
  const orderQueryResult = await client.query(orderQuery, [
    orderId,
    date,
    totalAmount,
  ]);
  console.log('OrderQueryResult', orderQueryResult);

  // Populate the MN table CartOrder
  const cartOrderQuery =
    'INSERT INTO "Project".cartorder (cartid, orderid) VALUES($1, $2)';
  const cartOrderQueryResult = await client.query(cartOrderQuery, [cartId, orderId]);
  console.log('cartOrderQueryResult', cartOrderQueryResult);
  res.send("Your payment is proceeded!");
});

////////////////////////////////////
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
