require("../tools/db");
var Item = require("../models/item");


Item.create({
	title:"吃饭",
	userId:"59f3f425e271921848d96a1e"
},function (err) {
	if(!err){
		console.log("插入成功~~~");
	}
});