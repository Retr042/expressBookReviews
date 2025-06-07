const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"Hugo Reyes", "password":"pswd"}];

const usuarioExistente = (username) => {     //verifica si el nombre de usuario ya existe
    
    let mismoUsuario = users.filter((user) =>{
         return user.username === username;
    })

    if(mismoUsuario.length > 0){   //Si encuentra un usuario con el mismo nombre retorna true
        return true;
    }else{
        return false;
    }
}


//verifica si existe un usuario con una contraseña en la BD (array users[])
const usuarioAutenticado = (username, password) => {
    //filtra los usuarios, buscando el nombre y la contraseña 
    let usuarioRegistrado = users.filter((user) =>{
         return (user.username === username && user.password === password)
    })

    //retorna true si el usuario introducido existe en la BD
  if(usuarioRegistrado.length > 0){
    return true;
  }else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: 'Datos incompletos'})
  }

  if(usuarioAutenticado(username,password)){

    let tokenAcceso = jwt.sign({
      data : password
    }, 'access', {expiresIn: 60 *60});

    req.session.authorization ={
      tokenAcceso, username
    }
    return res.status(200).send('Usuario loggeado exitosamente');
  }else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  let newReview = req.query.review;
  const username = req.session.authorization.username;

  if(!books[ISBN]){
     res.status(404).json({message: 'No existe libro con ese ISBN '})
  }

  if(!newReview){
      res.status(404).json({message: 'No se proporciono ninguna reseña'})
  }

    books[ISBN].reviews[username] = newReview
    res.send('Reseña agregada exitosamente: ' + newReview)
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
  const ISBN = req.params.isbn
   let username = req.session.authorization.username;
   // Validamos si el libro existe
  if (!books[ISBN]) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  // Validamos si el usuario tiene una reseña registrada
  if (books[ISBN].reviews && books[ISBN].reviews[username]) {
    delete books[ISBN].reviews[username]; // Eliminamos la reseña del usuario
    return res.status(200).json({ message: "Reseña eliminada exitosamente" });
  } else {
    return res.status(404).json({ message: "No existe una reseña tuya para este libro" });
  }
});
module.exports.authenticated = regd_users;
module.exports.usuarioExistente = usuarioExistente;
module.exports.users = users;
