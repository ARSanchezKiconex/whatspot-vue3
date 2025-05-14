const mysqlAdapter = {};

const database = require("../connections/mysql");
const pool = database.pool;


mysqlAdapter.query = (sql, data) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, data,
      (error, elements) => {
        if (error) {
          return resolve({ error: true, errorInfo: error });
        }
        return resolve(elements);
      });
  });
};

module.exports = mysqlAdapter;
