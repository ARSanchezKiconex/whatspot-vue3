const mysqlAdapter = require("../utils/mysqlAdapter");

class Booking {

  contructor(uuid) {
    this.uuid = uuid;
    this.user_uuid = "";
    this.room_uuid = "";
    this.start_date = "";
    this.end_date = "";
    this.start_time = "";
    this.end_time = "";
    this.title = "";
    this.details = "";
  }

  set(data) {
    this.user_uuid = data.user_uuid;
    this.room_uuid = data.room_uuid;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.title = data.title;
    this.details = data.details;
  }

  get() {
    const data = {
      uuid: this.uuid,
      user_uuid: this.user_uuid,
      room_uuid: this.room_uuid,
      start_date: this.start_date,
      end_date: this.end_date,
      start_time: this.start_time,
      end_time: this.end_time,
      title: this.title,
      details: this.details
    };
    return data;
  }
  
  async create() {
    const data = this.getData();
    const result = await mysqlAdapter.query("INSERT INTO booking set ? ", data);
    return result;
  }

  async update() {
    const data = this.getData();
    const result = await mysqlAdapter.query("UPDATE booking set ? WHERE uuid = ?", [data, this.uuid]);
    return result;
  }

  async delete() {
    const result = await mysqlAdapter.query("DELETE FROM booking WHERE uuid = ?", [this.uuid]);
    return result;
  }

  async list() {
    const rows = await mysqlAdapter.query('SELECT uuid, user_uuid, room_uuid, start_date, end_date, start_time, end_time, title, details FROM booking', []);
    return this.bookingObjectList(rows);
  }

  bookingObjectList(dataList) {
    return dataList.map(data => {
      const booking = new Booking(data.uuid);
      booking.set(data);
      return booking;
    });
  }
}

module.exports = Booking;
