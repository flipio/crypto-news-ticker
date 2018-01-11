var Model = require('objection').Model;

// Extends Model constructor.
function Traps() {
  Model.apply(this, arguments);
}

Model.extend(Traps);
module.exports = Traps;

// Table name is the only required property;
Traps.tableName = '33traps';

