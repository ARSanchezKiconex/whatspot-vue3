const uuid = require("uuid");
const Room = require("../models/Booking");
const Booking = require("../models/Booking");

const bookingCtrl = {};



bookingCtrl.createBooking = async (req, res) => {
  const { user_uuid, room_uuid, start_date, end_date, start_time, end_time, title, details } = req.body;

  if (!user_uuid || !room_uuid || !start_date || !end_date || !start_time || !end_time || !title ) {
    return res.send({ message: "El usuario, sala, fecha y hora, y titulo son obligatorios." });
  }

  const newBooking = new Booking(uuid.v4());
  newBooking.set(req.body);

  const result = await newBooking.create();

  if (result.error) {
    return res.json({ ok: false, message: "Error al crear la sala" });
  } else {
    return res.json(result);
  }
};


bookingCtrl.getBookings = async (req, res) => {
  const booking = new Booking();
  const result = await booking.list();

  if (result.error) {
    res.json({ ok: false, message: "Error al obtener las reservas" });
  } else {
    res.json(result);
  }
};


bookingCtrl.getBooking = async (req, res) => {
  const uuid = req.params.uuid;

  let booking = new Booking(uuid);
  const result = await booking.read();

  if (result.error) {
    return res.json({ ok: false, message: "Error al obtener la reserva" });
  } else {
    return res.json(result);
  }
};


bookingCtrl.getBookingByUser = async (req, res) => {
  const user_uuid = req.params.user_uuid;

  const booking = new Booking();
  const filter = { 'user_uuid': user_uuid };
  const result = await booking.read(filter);

  if (result.error) {
    return res.json({ ok: false, message: "Error al obtener las reservas del usuario" });
  } else {
    return res.json(result);
  }
};


//TODO: que solo los dueños o admin puedan editar y que dguarde lo anterior si no se cambia. 
bookingCtrl.editBooking = async (req, res) => {
  const uuid = req.params.uuid;

  let booking = new Booking(uuid);
  booking.set(req.body);  
  const result = await booking.update();

  if (result.error) {
    return res.json({ ok: false, message: "Error al actualizar la reserva" });
  } else {
    return res.json(result);
  }
};


bookingCtrl.deleteBooking = async (req, res) => {
  const uuid = req.params.uuid;

  let booking = new Booking(uuid);
  const result = await booking.delete();

  if (result.error) {
    return res.json({ ok: false, message: "Error al eliminar la reserva" });
  } else {
    return res.json({ ok: true, message: "Reserva eliminada correctamente" });
  }
};

module.exports = bookingCtrl;
