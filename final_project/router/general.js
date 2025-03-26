const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ "username": username, "password": password });
  return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const fetchBooks = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books) {
            resolve(books);
          } else {
            reject(new Error("Failed to fetch books"));
          }
        }, 200);
      });
    };
    const bookData = await fetchBooks();
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const fetchBookByISBN = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        }, 200);
      });
    };
    const bookData = await fetchBookByISBN();
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const fetchBooksByAuthor = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const result = Object.values(books).filter(book => book.author === author);
          if (result.length > 0) {
            resolve(result);
          } else {
            reject(new Error("Books by author not found"));
          }
        }, 200);
      });
    };
    const bookData = await fetchBooksByAuthor();
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const fetchBooksByTitle = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const result = Object.values(books).filter(book => book.title === title);
          if (result.length > 0) {
            resolve(result);
          } else {
            reject(new Error("Books with title not found"));
          }
        }, 200);
      });
    };
    const bookData = await fetchBooksByTitle();
    return res.status(200).json(bookData);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.general = public_users;