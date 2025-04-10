const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const token = req.session.authorization; // Get the token from session

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token.accessToken, "accessSecretKey", (err, user) => { // Verify the token
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token." });
    }

    req.user = user; // Store the user data in the request object
    next(); // Proceed to the next middleware or route handler
  });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
