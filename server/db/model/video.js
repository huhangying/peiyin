/**
 * Created by hhu on 2015/12/24.
 */


var Schema = global.mongoose.Schema;

var _Video = Schema({
  //cat_id: {type: Schema.Types.ObjectId, ref: 'category' },
  name: {type:String, required: true},
  desc: String,
  url: String,
  dl_url: String,
  poster: String,
  icon: String,
  datetime: {type : Date, default: Date.now},
  from: String,
  author: String,
  vote: Number,
  tags: { type: [String], index: true },
  comments: [{type: Schema.Types.ObjectId, ref: 'comment' }], //comment model定义的名字，跟数据库表名相关
  apply: {type : Boolean, default: true}
});



// 基于Schema的方法 // for test
_Video.static('getTest', function(){
  return 'test';
});

module.exports =  mongoose.model('video', _Video);


