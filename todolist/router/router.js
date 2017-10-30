//引入express
var express = require("express");
//创建路由对象
var router = express.Router();
//引入UserModel
var User = require("../models/user");
//引入ItemModel
var Item = require("../models/item");
//引入sha1
var sha1 = require("sha1");

//向res.locals中添加一个msg对象
router.use(function (req , res , next) {
	res.locals.msg = {};
	next();
});

//为首页映射路由
router.get("/",function (req , res) {
	res.redirect("/item_list");
});

//为ejs映射路由
router.get("/login",function (req , res) {
	res.render("login");
});

router.get("/register",function (req , res) {
	res.render("register");
});

router.get("/item_list",checkLogin ,function (req , res) {

	//获取当前用户的id
	var userId = req.session.loginUser._id;
	//根据用户id查询他的待办事项
	Item.find({userId:userId , state:{$ne:0}},function (err , items) {
		res.render("item_list",{items:items});
	});



});

//该函数专门用来检查用户是否登录
function checkLogin (req , res , next) {
	//判断用户是否登录
	if(!req.session.loginUser){
		//用户没有登录，跳转登录页面
		res.render("login",{msg:{err:"请登录以后再访问该页面"}});
	}else{
		//用户登录
		next();
	}

}

//创建一个路由，用来修改待办事项的内容
router.post("/updateTitle",checkLogin,function (req , res) {
	//获取待办事项的id
	var itemId = req.body.id;

	//获取要修为的内容
	var title = req.body.title;

	//获取当前用户的id
	var userId = req.session.loginUser._id;

	//修改指定item
	Item.updateOne({_id:itemId , userId:userId},{$set:{title:title , state:1}},function (err) {
		//跳转到item_list
		res.redirect("/item_list");
	});



});

//创建一个路由，用来修改待办事项的状态
router.get("/updateState" , checkLogin , function (req , res) {
	//获取待办事项的id
	var itemId = req.query.id;

	//获取到要修改成的状态
	var state = req.query.state;

	//获取当前用户的id
	var userId = req.session.loginUser._id;

	//修改指定item
	Item.updateOne({_id:itemId , userId:userId},{$set:{state:state}},function (err) {
		//跳转到item_list
		res.redirect("/item_list");
	});

});

//创建一个路由，用来处理添加待办事项的功能
router.post("/addItem",checkLogin,function (req , res) {

	//获取用户填写的标题
	var title = req.body.title;

	//获取当前用户的id
	var userId = req.session.loginUser._id;

	//调用Item将待办事项插入到数据库中
	Item.create({
		title:title,
		userId:userId
	},function (err) {
		//跳转到item_list
		res.redirect("/item_list");
	});

});

//创建一个路由，用来处理登出
router.get("/logout",function (req , res) {
	//删除session中的user对象
	//delete req.session.loginUser;
	req.session.destroy();

	//重定向到登录页面
	res.redirect("/login");
});


//创建一个处理登录的路由
router.post("/login",function (req , res) {

	//获取用户发送的用户名和密码
	var username = req.body.username.trim();
	var password = req.body.password.trim();

	//去数据库中验证用户名和密码是否正确
	User.findOne({username:username},function (err , user) {
		if(!err && user && user.password == sha1(password)){
			//登录成功，将用户对象放入到session中
			req.session.loginUser = user;

			//登录成功 重定向到item_list
			res.redirect("/item_list");
		}else{
			//登录失败 返回登录页面重新输入
			res.render("login",{msg:{err:"用户名或密码错误" , username:username}});
		}
	});


});

//创建处理注册功能的路由
router.post("/regist",function (req , res) {
	//获取用户填写的内容 用户名 密码 确认密码 电子邮件
	var username = req.body.username.trim();
	var password = req.body.password.trim();
	var repwd = req.body.repwd.trim();
	var email = req.body.email.trim();

	//验证用户的输入是否合法
	//创建正则表达式
	var nameReg = /^[a-z0-9_-]{3,16}$/i;
	var pwdReg = /^[a-z0-9_-]{6,18}$/i;
	var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;

	//创建一个对象，用来保存错误消息
	var msg = {
		username:username,
		email:email
	};

	//通过正则表达式来验证用户的信息
	if(!nameReg.test(username)){
		//用户名不合法
		msg.umErr = "请输入3-16位包含字母、数字、_、-的用户名";
	}

	//验证密码
	if(!pwdReg.test(password)){
		//密码不合法
		msg.pwdErr = "请输入6-18位包含字母、数字、_、-的密码";
	}

	//验证确认密码
	if(repwd != password){
		//两次输入的不一致
		msg.repwdErr = "两次输入的密码不一致";
	}

	//验证电子邮箱
	if(!emailReg.test(email)){
		//邮箱格式不正确
		msg.emailErr = "电子邮箱的格式不正确";
	}

	//确认是否通过验证
	if(msg.umErr || msg.pwdErr || msg.repwdErr || msg.emailErr){
		//没有通过验证,返回注册页面，并显示错误消息
		res.render("register",{msg:msg});

		return;
	}


	//验证通过，将用户插入到数据库中
	User.create({
		username:username,
		password:sha1(password),
		email:email
	},function (err) {

		if(err){
			//出错了，注册失败，回到注册页面重新输入用户信息
			msg.err = "用户名已存在";
			res.render("register",{msg:msg});

		}else{
			//注册成功，跳转到登录页面
			//res.redirect("/login");
			res.render("login",{msg:{success:"恭喜您注册成功，请登录！"}});
		}

	});



});



//暴露router
module.exports = router;