const mongoose = require("mongoose");

// Mongoose Create Connection
module.exports = mongoose.connect
('mongodb+srv://weebmeet:HeAeEH2rgum9QwgF@webmeet.scwn2.mongodb.net/MyDataBase?retryWrites=true&w=majority'
, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
