var Model = require('objection').Model;

// Extends Model constructor.
function OHLCTicker() {
  Model.apply(this, arguments);
}

Model.extend(OHLCTicker);
module.exports = OHLCTicker;

// Table name is the only required property;
OHLCTicker.tableName = 'ohlc_ticker';

// Model logic is created via virtual attributes using the prototype property and then referencing it as a an array of virtualAttributes
OHLCTicker.virtualAttributes = ['currency'];

OHLCTicker.prototype.currency = function(){
  return this.type;
};
