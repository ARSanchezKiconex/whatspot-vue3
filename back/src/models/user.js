const bcryptjs = require("bcryptjs");
const mysqlAdapter = require("../utils/mysqlAdapter");

class User {
  constructor(uuid) {
    this.uuid = uuid;
    this.user = "";
    this.mail = "";
    this.name = "";
    this.password = "";
  }

  set(data) {
    this.user = data.user;
    this.mail = data.mail;
    this.name = data.name;
    this.password = bcryptjs.hashSync(data.password, 0);
    return this;
  }

  getData() {
    return {
      uuid: this.uuid,
      user: this.user,
      mail: this.mail,
      name: this.name,
      password: this.password,
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

  static userObjectList(dataList) {
    return dataList.map(data => {
      const user = new User(data.uuid);
      user.set(data);
      return user;
    });
  }
}

module.exports = User;
