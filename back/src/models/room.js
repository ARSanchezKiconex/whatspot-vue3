const mysqlAdapter = require("../utils/mysqlAdapter");

class Room {
  constructor() {
    this.uuid = "";
    this.name = "";
    this.capacity = 0;
    this.facility_uuid = "";
  }

  set(data) {
    this.facility_uuid = data.facility_uuid;
    this.name = data.name;
    this.capacity = data.capacity;
    return this;
  }

  getData() {
    return {
      uuid: this.uuid,
      facility_uuid: this.facility_uuid,
      name: this.name,
      capacity: this.capacity
    };
  }

  async create() {
    const data = this.getData();
    const result = await mysqlAdapter.query("INSERT INTO rooms SET ?", data);
    return result;
  }

  async update() {
    const data = this.getData();
    const result = await mysqlAdapter.query("UPDATE rooms SET ? WHERE uuid = ?", [data, this.uuid]);
    return result;
  }

  async delete() {
    return mysqlAdapter.query("DELETE FROM rooms WHERE uuid = ?", [this.uuid]);
  }

  async list() {
    const rows = await mysqlAdapter.query("SELECT uuid, facility_uuid, name, capacity FROM rooms", []);
    return this.roomObjectList(rows);
  }

  // Esta función es opcional, igual que en el modelo User
  roomObjectList(dataList) {
    return dataList.map(data => {
      const room = new Room(data.uuid);
      room.set(data);
      return room;
    });
  }
}

module.exports = Room;
