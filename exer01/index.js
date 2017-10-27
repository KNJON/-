//引入express
var express = require("express");
//引入sha1
var sha1 = require("sha1");
//引入db 来连接数据库
require("./tools/db");
//引入UserModel
var User = require("./models/user");

//创建应用对象
var app = express();
//配置静态资源
app.use(express.static("public"));

//配置路由
app.get("/login",function (req , res) {

	//获取用户填写的用户名和密码
	var username = req.query.username;
	var password = req.query.password;

	//检查用户名和密码是否正确
	/*if(username == "admin" && password == "123123"){
		//登录成功
		res.send("<h1>恭喜您登录成功！</h1>");
	}else{
		//登录失败
		res.send("<h1 style='color: red;'>不好意思，您的用户名或密码好像是输错了~~~</h1>");
	}*/

	//去数据库中验证用户名和密码是否正确
	User.findOne({username:username},function (err , user) {

		if(!err && user && user.password == sha1(password)){
			//登录成功
			res.send("<h1>恭喜您登录成功！</h1>");
		}else{
			//登录失败
			//res.send("<h1 style='color: red;'>不好意思，您的用户名或密码好像是输错了~~~</h1>");
			//回到登录页面，重新登录
			res.redirect("/login.html")
		}

	});


});

app.get("/test" , function (req , res) {
	res.send('<!DOCTYPE html>' +
		'<html lang="zh">' +
		'<head>' +
		'<meta charset="UTF-8">' +
		'<title>欢迎登录</title>' +
		'</head>' +
		'<body>'
		+"动态生成的内容"+
		'</body>' +
		'</html>');
});

//创建一个路由用来处理注册
app.get("/regist",function (req , res) {

	//获取用户的请求参数
	var username = req.query.username;
	var password = req.query.password;
	var repwd = req.query.repwd;
	var email = req.query.email;

	//console.log(username,password,repwd,email);
	//验证用户的输入的是否合法（省略）

	//验证通过，将用户的信息插入到数据库中
	User.create({
		username:username,
		password:sha1(password),
		email:email
	},function (err) {
		if(err){
			//出错了，用户名已存在，返回一个错误消息
			res.send("不好意思，用户名已存在，再起一个吧~~~");
		}else{
			//注册成功
			res.send("恭喜您，注册成功！！");
		}
	});



});



app.listen(3000,function () {
	console.log("ok");
});
