const express = require('express');
let books = require("./booksdb.js");
let usuarioExistente = require("./auth_users.js").usuarioExistente;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username =req.body.username;
  const password = req.body.password;

  if(username && password){

    if(!usuarioExistente(username)){

        users.push({"username": username, "password": password});
        return res.status(200).json({message: "Usuario: " +username + "registrado correctamente"});
    }else{
      return res.status(404).json({message: "Nombre de usuario en uso, selecciona otro"})
    }
  }
  return res.status(404).json({message: "No se pudo registrar el usuario"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let ISBN = req.params.isbn;
  res.send(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const autor = req.params.author; //almacenamos  el autor
   let arrayBooks = Object.values(books) //convertimos objeto books a ARRAY

     let filtrar_Autor =arrayBooks.filter((book) => book.author  == autor)
     res.send(filtrar_Autor) //enviar resultado

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let titulo = req.params.title   //almacenamos  el titulo
  let arrayBooks = Object.values(books) //convertimos objeto books a ARRAY
   let filtrarporTitulo = arrayBooks.filter((book) => book.title == titulo) //iteramos para encontrar la coincidencia de titulo
   res.send(filtrarporTitulo); //enviar resultado
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  if(books[ISBN]) {
    res.send(books[ISBN].reviews)
  }else{
    res.send('No se encontraron libros con ISBN:' + ISBN)
  }
  
});

module.exports.general = public_users;
