import contactsService, { listContacts } from "../services/contactsServices.js";

const express = require("express");
const app = express();

// export const getAllContacts = (req, res) => {
//   listContacts();

//   res.end();
// };

export const getOneContact = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
