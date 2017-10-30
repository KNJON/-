//来定义item(待办事项)模型
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//创建约束对象
var itemSchema = new Schema({
	title:String,
	state:{  //0删除  1未完成（默认值）  2完成
		type:Number,
		default:1
	},
	userId:Schema.Types.ObjectId
});


//将item暴露出去
module.exports = mongoose.model("item",itemSchema);