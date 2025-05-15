const bcryptjs = require("bcryptjs");
const mysqlAdapter = require("../utils/mysqlAdapter");

class User {
  constructor(uuid) {
    this.uuid = uuid;
    this.user = "";
    this.mail = "";
    this.name = "";
    this.password = "";
    this.isAdmin = false;
  }

  set(data) {
    this.user = data.user;
    this.mail = data.mail;
    this.name = data.name;
    this.password = bcryptjs.hashSync(data.password, 0);
    this.isAdmin = data.isAdmin || false;
    return this;
  }

  getData() {
    return {
      uuid: this.uuid,
      user: this.user,
      mail: this.mail,
      name: this.name,
      password: this.password,
      isAdmin: this.isAdmin
    };
  }

  async create() {
    const data = this.getData();
    const result = await mysqlAdapter.query("INSERT INTO users SET ?", data);
    return result;
  }

  async update() {
    const data = this.getData();
    const result = await mysqlAdapter.query("UPDATE users SET ? WHERE uuid = ?", [data, this.uuid]);
    return result;
  }

  async delete() {
    return mysqlAdapter.query("DELETE FROM users WHERE uuid = ?", [this.uuid]);
  }

  async list() {
    const rows = await mysqlAdapter.query("SELECT uuid, user, mail, name, isAdmin FROM users", []);
    return rows;
  }

  read(filter = {}) {
    let data = [];
    let sql = "SELECT uuid, user, mail, name, isAdmin FROM users WHERE 1";
    if (Object.keys(filter).length === 0) {
      sql += " AND uuid = ?";
      data.push(this.uuid);
    }

    return mysqlAdapter.query(sql, data);
  };
}

module.exports = User;
