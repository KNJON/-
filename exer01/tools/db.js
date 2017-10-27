/*
	该模块专门用来连接MongoDB数据库
 */
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/exer01",{useMongoClient:true});
mongoose.connection.on("open",function () {
	console.log("MongoDB数据库已经成功连接");
});