/*
	测试UserModel
 */
require("../tools/db");
var User = require("../models/user");

User.create({
	username:"admin",
	password:"123123",
	emial:"admin@admin.com"
},function (err) {
	if(!err){
		console.log("注册成功");
	}else{
		console.log(err);
	}
});
