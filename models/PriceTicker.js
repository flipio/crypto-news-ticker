var Model = require('objection').Model;

// Extends Model constructor.
function PriceTicker() {
  Model.apply(this, arguments);
}

Model.extend(PriceTicker);
module.exports = PriceTicker;

// Table name is the only required property;
PriceTicker.tableName = 'price_ticker';

// Model logic is created via virtual attributes using the prototype property and then referencing it as a an array of virtualAttributes
PriceTicker.virtualAttributes = ['currency'];

PriceTicker.prototype.currency = function(){
  return this.type;
};
