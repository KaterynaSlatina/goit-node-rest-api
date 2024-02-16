import {
  listContacts,
  // getContactById,
  // removeContact,
  // addContact,
} from "../services/contactsServices.js";

// const express = require("express");
// const app = express();

export const getAllContacts = async (req, res) => {
  try {
    const data = await listContacts();
    res.status(200).send(JSON.parse(data));
  } catch (error) {
    console.error(error.message);
  }
};

export const getOneContact = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};

// app.listen(8080, () => {
//   console.log("Server started on port 8080");
// });
