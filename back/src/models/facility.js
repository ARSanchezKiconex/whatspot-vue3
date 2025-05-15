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
    const result = await mysqlAdapter.query("INSERT INTO facilities SET ?", data);
    return result;
  }

  async update() {
    const data = this.getData();
    const result = await mysqlAdapter.query("UPDATE facilities SET ? WHERE uuid = ?", [data, this.uuid]);
    return result;
  }

  async delete() {
    return mysqlAdapter.query("DELETE FROM facilities WHERE uuid = ?", [this.uuid]);
  }

  async list() {
    const rows = await mysqlAdapter.query("SELECT uuid, name FROM facilities", []);
    return rows;
  }

  read(filter = {}) {
    let data = [];
    let sql = "SELECT uuid, name FROM facilities WHERE uuid = ?";
    if (Object.keys(filter).length === 0) {
      sql += " AND uuid = ?";
      data.push(this.uuid);
    }

    return mysqlAdapter.query(sql, data);
  };

}

module.exports = Facility;
