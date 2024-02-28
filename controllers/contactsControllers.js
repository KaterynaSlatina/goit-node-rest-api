import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const delContact = await Contact.findByIdAndDelete(id);

    if (!delContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(delContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    const newContact = await Contact.create(contact);

    if (!newContact) {
      throw HttpError(409, "Contact already exists");
    }

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedContact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const nonEmptyFields = Object.entries(updatedContact).filter(
      ([_, value]) => value !== null && value !== undefined
    );

    if (nonEmptyFields.length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const result = await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateFavoriteContact = async (req, res, next) => {
  try {
    const favorite = req.body.favorite;
    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      {
        new: true,
      }
    );
    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
