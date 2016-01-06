/**
 * Created by hhu on 2016/1/5.
 */

var Schema = global.mongoose.Schema;
var _Vote = new Schema({
  video: {type: Schema.Types.ObjectId, ref: 'video' },
  //author: {type: Schema.Types.ObjectId, ref: 'user' },
  user: {type: Schema.Types.ObjectId, ref:'user'},
  vote: {type:Number, default: 0},
  updated: {type : Date, default: Date.now} // 每天只能投一次
});

module.exports =  mongoose.model('vote', _Vote);
