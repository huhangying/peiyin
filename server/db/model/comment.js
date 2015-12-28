/**
 * Created by hhu on 2015/12/25.
 */

var Schema = global.mongoose.Schema;

var _Comment = new Schema({
  video: {type: Schema.Types.ObjectId, ref: 'video' },
  author: {type: Schema.Types.ObjectId, ref: 'user' },
  at_friend: {type: Schema.Types.ObjectId, ref: 'user' },   //@好友
  comment: String,
  created: {type : Date, default: Date.now},
});

module.exports =  mongoose.model('comment', _Comment);
