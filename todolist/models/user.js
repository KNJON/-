//来定义user的模型
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//创建约束对象
var userSchema = new Schema({
	username:{
		type:String,
		unique:true
	},
	password:String,
	email:String
});


//将Student暴露出去
module.exports = mongoose.model("user",userSchema);