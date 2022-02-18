const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: String,
  gender: String,
  orgId: String,
});

module.exports = mongoose.model('Patient', patientSchema);
