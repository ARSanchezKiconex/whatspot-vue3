const uuid = require("uuid");
const Room = require("../models/Room");

const roomCtrl = {};


roomCtrl.createRoom = async (req, res) => {
  const { name, capacity, facility_uuid } = req.body;

  if (!name || !capacity || !facility_uuid) {
    return res.send({ message: "El nombre, capacidad y facility_uuid son obligatorios." });
  }

  const newRoom = new Room(uuid.v4());
  newRoom.set(req.body);

  const result = await newRoom.create();

  if (result.error) {
    return res.json({ ok: false, message: "Error al crear la sala" });
  } else {
    return res.json(result);
  }
};

roomCtrl.getRooms = async (req, res) => {

  console.log('legando a getRooms');

  const room = new Room();
  const result = await room.list();

  if (result.error) {
    res.json({ ok: false, message: "Error al obtener las salas" });
  } else {
    res.json(result);
  }
};

roomCtrl.getRoom = async (req, res) => {
  // const uuid = req.params.uuid;

  // let room = new Room(uuid);
  // const result = await room.get(); // OJO CON EL GET Y LA FORMA DE SACAR LA SALA DE AQUI

  // if (result.error) {
    return res.json({ ok: false, message: "Error al obtener la sala" });
  // } else {
  //   return res.json(result);
  // }
};

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

roomCtrl.editRoom = async (req, res) => {
  const uuid = req.params.uuid;

  let room = new Room(uuid);
  room.set(req.body);  
  const result = await room.update();

  if (result.error) {
    return res.json({ ok: false, message: "Error al actualizar la sala" });
  } else {
    return res.json(result);
  }
};

roomCtrl.deleteRoom = async (req, res) => {
  const uuid = req.params.uuid;

  let room = new Room(uuid);
  const result = await room.delete();

  if (result.error) {
    return res.json({ ok: false, message: "Error al eliminar la sala" });
  } else {
    return res.json({ ok: true, message: "Sala eliminada correctamente" });
  }
};

module.exports = roomCtrl;
