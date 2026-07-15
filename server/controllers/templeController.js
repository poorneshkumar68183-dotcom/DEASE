import Temple from "../models/Temple.js";

export const getAllTemples = async (req, res) => {

  try {

    const temples = await Temple.find();

    res.json(temples);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};
export const getTempleById = async (req, res) => {

  try {

    const temple = await Temple.findById(req.params.id);

    if (!temple) {

      return res.status(404).json({
        error: "Temple not found",
      });

    }

    res.json(temple);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};
export const createTemple = async (req, res) => {

  try {

    const {
      name,
      location,
      state,
      description,
      image,
      rating,
      nextAvailableSlot,
      category,
      pujas,
      darshanPrice
    } = req.body;

    if (!name || !location || !state) {

      return res.status(400).json({
        error: "Name, location, and state are required",
      });

    }

    const newTemple = await Temple.create({

      name,
      location,
      state,
      description: description || "",
      image: image || "",
      rating: rating || 4.5,
      nextAvailableSlot: nextAvailableSlot || "Slots Available Today",
      category: category || "Popular",
      pujas: pujas || [],
      darshanPrice: darshanPrice || 0

    });

    res.status(201).json(newTemple);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};
export const updateTemple = async (req, res) => {

  try {

    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!temple) {
      return res.status(404).json({
        error: "Temple not found",
      });
    }

    res.json(temple);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};
export const deleteTemple = async (req, res) => {

  try {

    const temple = await Temple.findByIdAndDelete(
      req.params.id
    );

    if (!temple) {
      return res.status(404).json({
        error: "Temple not found",
      });
    }

    res.json({
      message: "Temple deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};