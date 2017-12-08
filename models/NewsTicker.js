var Model = require('objection').Model;
var Post = require('./Post');

// Extends Model constructor.
function NewsTicker() {
  Model.apply(this, arguments);
}

Model.extend(NewsTicker);
module.exports = NewsTicker;

// Table name is the only required property;
NewsTicker.tableName = 'news_ticer';
