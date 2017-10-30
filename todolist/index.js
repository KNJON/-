//引入express
var express = require("express");
//引入body-parser
var bodyParser = require("body-parser");
//引入路由
var router = require("./router/router");
//连接数据库
require("./tools/db");

//创建应用对象
var app = express();

var session = require("express-session");

/*
	使用connect-mongo 来处理session的持久化
		使用步骤
			1.下载安装
 				npm i connect-mongo --save
 			2.引入模块
 				var MongoStore = require('connect-mongo')(session);
 			3.将其配置为express-session的默认的持久化仓库
				 var mongoose = require("mongoose");

				 //设置为中间件
				 app.use(session({
					 resave:false,
					 saveUninitialized:false,
					 secret:"todolist",
					 store: new MongoStore({ mongooseConnection: mongoose.connection })
				 }));


 */
var MongoStore = require('connect-mongo')(session);


var mongoose = require("mongoose");

//设置为中间件
app.use(session({
	resave:false,
	saveUninitialized:false,
	secret:"todolist",
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));



//配置模板引擎
app.set("view engine","ejs");
app.set("views" , "views");

//配置静态资源
app.use(express.static("public"));
//配置解析post请求体的中间件
app.use(bodyParser.urlencoded({extended:false}));


//创建一个路由处理session
app.use(function (req , res , next) {
	res.locals.session = req.session;
	next();
});

//使路由生效
app.use(router);


//配置一个处理404的中间件
//当用户访问的资源路径不正确则会调用该中间件
app.use(function (req , res) {
	res.status(404);
	res.render("404");
});



app.listen(3000,function () {
	console.log("OK");
});