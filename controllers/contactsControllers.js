import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (contact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Contact not found");
    }

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
    const contact = await Contact.findById(id);
    if (contact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Contact not found");
    }
    const delContact = await Contact.deleteOne(id);
    // const delContact = await Contact.findByIdAndDelete(id);

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
      owner: req.user.id,
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
      owner: req.user.id,
    };

    const nonEmptyFields = Object.entries(updatedContact).filter(
      ([_, value]) => value !== null && value !== undefined
    );

    if (nonEmptyFields.length === 0) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const contact = await Contact.findById(id);
    if (contact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Contact not found");
    }

    const result = await Contact.updateOne(contact, updatedContact);

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

    const contact = await Contact.findById(id);
    if (contact.owner.toString() !== req.user.id) {
      throw HttpError(404, "Contact not found");
    }

    const updatedContact = await Contact.updateOne(contact, { favorite });

    if (!updatedContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
