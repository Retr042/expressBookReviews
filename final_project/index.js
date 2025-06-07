const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


//middleware para autenticar los request hacia el endpoint "/customer/auth"
app.use("/customer/auth/*", function auth(req,res,next){

    //verifica si el usuario esta loggeado y tiene el token de acceso
  if( req.session.authorization) {
    let token = req.session.authorization['tokenAcceso'];
 
    //verifica el token JWT
    jwt.verify(token, "access",(err, user) => {
        if(!err){
            req.user = user;
            next();  //token verificado, procede a hacer el request
        }else {
            return res.status(403).json({message : "Usuario no autenticado"})
        }
    })

  } else {
      return res.status(403).json({message: "Inicia sesion primero : User not logged in"})
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
