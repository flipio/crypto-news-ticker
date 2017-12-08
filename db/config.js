
const knexfile = require('../knexfile');
const env = process.env.NODE_ENV || "development";

// ==BP: SETUP KNEX AND OBJECTION DATABASE
// Initialize knex.
const config = knexfile [env.toLowerCase()];
const knex = require("knex")(config);

// // =====Require Objection.js
// // Bind all Models to a knex instance. If you only have one database in your server this is all you have to do. For multi database systems, see the Model.bindKnex method.
const Model = require('objection').Model;
Model.knex(knex);
