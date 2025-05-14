const uuid = require("uuid");
const Room = require("../models/Room");

const roomCtrl = {};

// Crear una nueva sala
roomCtrl.createRoom = async (req, res) => {
  const { name, capacity, facility_uuid } = req.body;

  if (!name || !capacity || !facility_uuid) {
    return res.send({ message: "El nombre, capacidad y facility_uuid son obligatorios." });
  }

  const newRoom = new Room(uuid.v4());
  newRoom.set(req.body); // Asignamos los datos de la sala a la instancia de Room

  const result = await newRoom.create();

  if (result.error) {
    return res.json({ ok: false, message: "Error al crear la sala" });
  } else {
    return res.json(result);
  }
};

// Obtener una lista de todas las salas
roomCtrl.getRooms = async (req, res) => {
  const room = new Room();
  const result = await room.list();

  if (result.error) {
    return res.json({ ok: false, message: "Error al obtener las salas" });
  } else {
    return res.json(result);
  }
};

// Obtener detalles de una sala específica por su UUID
roomCtrl.getRoom = async (req, res) => {
  const uuid = req.params.uuid;

  let room = new Room(uuid, false);
  const result = await room.read();

  if (result.error) {
    return res.json({ ok: false, message: "Error al obtener la sala" });
  } else {
    return res.json(result);
  }
};

// Editar los datos de una sala específica
roomCtrl.editRoom = async (req, res) => {
  const uuid = req.params.uuid;

  let room = new Room(uuid, false);
  room.set(req.body); // Actualizamos los datos de la sala
  const result = await room.update();

  if (result.error) {
    return res.json({ ok: false, message: "Error al actualizar la sala" });
  } else {
    return res.json(result);
  }
};

// Eliminar una sala
roomCtrl.deleteRoom = async (req, res) => {
  const uuid = req.params.uuid;

  let room = new Room(uuid, false);
  const result = await room.delete();

  if (result.error) {
    return res.json({ ok: false, message: "Error al eliminar la sala" });
  } else {
    return res.json({ ok: true, message: "Sala eliminada correctamente" });
  }
};

// Obtener todas las salas de una instalación específica (por facility_uuid)
roomCtrl.getRoomsByFacility = async (req, res) => {
  const facility_uuid = req.params.facility_uuid;

  const room = new Room();
  const filter = { 'facility_uuid': facility_uuid };
  const result = await room.list(filter);

  if (result.error) {
    return res.json({ ok: false, message: "Error al obtener las salas para la instalación" });
  } else {
    return res.json(result);
  }
};

module.exports = roomCtrl;
