var express = require("express");
require("./tools/mongo");
var CityModel = require("./models/city");
var app = express();
app.use(express.static("public"));

//定义路由，负责加载省市县的信息
//加载省份信息
app.get("/getSheng",function (req , res) {

	//db.cities.find({level:1});
	//调用CityModel来查询数据库中的所有的省份
	CityModel.find({level:1} , function (err , docs) {

		if(!err){
			//加载成功
			res.send({status:"ok" , list:docs});
		}else{
			//加载失败
			res.send({status:"error"});
		}

	});

});

//加载市的信息
app.get("/getDi",function (req , res) {

	//db.cities.find({level:2 , sheng:"21"});

	//获取当前选中的省份的信息
	var sheng = req.query.sheng;

	//调用CityModel来查询城市的信息
	CityModel.find({level:2 , sheng:sheng} , function (err , docs) {

		if(!err){
			res.send({status:"ok" , list:docs});
		}else{
			res.send({status:"error"});
		}

	});

});

//加载区县的信息
app.get("/getXian",function (req , res) {

	//db.cities.find({level:3 , sheng:"21" , di:"02"});

	//获取当前选中的省份的信息
	var sheng = req.query.sheng;
	//获取当前选中的城市的信息
	var di = req. query.di;

	//调用CityModel来查询区县的信息
	CityModel.find({level:3 , sheng:sheng , di:di} , function (err , docs) {

		if(!err){
			res.send({status:"ok" , list:docs});
		}else{
			res.send({status:"error"});
		}

	});

});



app.listen(3000,function () {
	console.log ( "已监听3000，并启动" );
	
});