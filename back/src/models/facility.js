const mysqlAdapter = require("../utils/mysqlAdapter");

class Facility {

  constructor(uuid) {
    this.uuid = uuid;
    this.name = "";
  }

  set(data) {
    this.name = data.name;
  }

  getData() {
    const data = {
      uuid: this.uuid,
      name: this.name
    };
    return data;
  }

  async create() {
    const data = this.getData();
    const result = await mysqlAdapter.query("INSERT INTO facility SET ?", data);
    return result;
  }

  async update() {
    const data = this.getData();
    const result = await mysqlAdapter.query("UPDATE facility SET ? WHERE uuid = ?", [data, this.uuid]);
    return result;
  }

  async delete() {
    return mysqlAdapter.query("DELETE FROM facility WHERE uuid = ?", [this.uuid]);
  }

  async list() {
    const rows = await mysqlAdapter.query("SELECT uuid, name FROM facility", []);
    return this.facilityObjectList(rows);
  }

  facilityObjectList(dataList) {
    return dataList.map(data => {
      const facility = new Facility(data.uuid);
      facility.set(data);
      return facility;
    });
  }
}

module.exports = Facility;
