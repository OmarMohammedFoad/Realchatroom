// var mongoose = require("mongoose")
const mongoose = require('mongoose');





const schema = new mongoose.Schema({ name: {type:'string'}, message: {type :'string' } });

module.exports = mongoose.model("user",schema)
