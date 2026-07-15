import Slot from "../models/Slot.js";

export const getSlotsByTemple = async (req, res) => {
  try {
    const slots = await Slot.find({
      temple: req.params.id,
      isActive: true,
    });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateSlot = async (req, res) => {
  try {
    const { limit, active } = req.body;

    if (limit === undefined || active === undefined) {
      return res.status(400).json({
        error: "Limit and active status are required",
      });
    }

    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        error: "Slot not found",
      });
    }

    slot.limit = Number(limit);
    slot.totalSeats = Number(limit);
    slot.availableSeats = Math.max(0, Number(limit) - slot.booked);
    slot.isActive = Boolean(active);

    await slot.save();

    res.json(slot);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};