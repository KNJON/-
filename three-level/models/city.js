const mongoose = require("mongoose");



//创建模式对象
const citySchema = new mongoose.Schema({
	code:String,
	sheng:String,
	di:String,
	xian:String,
	name:String,
	level:Number
});


module.exports = mongoose.model("city" , citySchema);