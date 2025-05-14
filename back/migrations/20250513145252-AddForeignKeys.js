'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  const sql = `
    ALTER TABLE booking ADD CONSTRAINT fk_user FOREIGN KEY (user_uuid) REFERENCES users(uuid);
    ALTER TABLE booking ADD CONSTRAINT fk_room FOREIGN KEY (room_uuid) REFERENCES rooms(uuid);
    ALTER TABLE rooms ADD CONSTRAINT fk_facility FOREIGN KEY (facility_uuid) REFERENCES facility(uuid);
  `;

  await db.runSql(sql);
  console.log("MIGRATE OK => Create foreign keys");
};

exports._meta = {
  version: 1
};