'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
   db.createTable('rooms', {
    uuid: { type: 'varchar', length:36, primaryKey: true },
    facility_uuid: { type: 'varchar', length: 36, notnull: true },
    name: { type: 'varchar', length: 100 },
    capacity: { type: 'int' },
  }, callback);
  console.log("MIGRATE OK => Create rooms table");
};

exports._meta = {
  "version": 1
};
