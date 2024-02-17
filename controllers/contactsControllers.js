import { error } from "console";
import {
  listContacts,
  getContactById,
  // removeContact,
  // addContact,
} from "../services/contactsServices.js";
import crypto from "crypto";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw new HttpError(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const delContact = await removeContact(id);
    if (!delContact) {
      throw new HttpError(404).json({ message: "Not found" });
    }
    res.status(200).json(delContact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const createContact = (req, res) => {
  try {
    const { name, email, phone } = req.body;
    res.status(201).send({ name, email, phone });
  } catch (error) {}
};

export const updateContact = (req, res) => {};
