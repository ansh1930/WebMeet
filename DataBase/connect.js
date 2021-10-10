const mongoose = require("mongoose");

// Mongoose Create Connection
module.exports = mongoose.connect
('paste Your Database URL'
, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
