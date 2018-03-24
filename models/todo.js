var mongoose = require('mongoose'),
Schema = mongoose.Schema;

//todo model
var todoSchema = new Schema({
title:String,
completed:{type:Boolean, default:false},
updated_at:{type:Date,default:Date.now}
});

mongoose.model('Todo', todoSchema);