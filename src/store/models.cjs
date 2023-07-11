const mongoose = require("mongoose");
const schemas = require("../schemas/index.cjs");

module.exports = Object.fromEntries(Object.entries(schemas).map(([key, value], index) => {
  return [key, mongoose.model(key, value)]
}))