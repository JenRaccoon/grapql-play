const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: String,
  bedNum: Number,
});

module.exports = mongoose.model('Organization', organizationSchema);
