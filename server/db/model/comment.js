/**
 * Created by hhu on 2015/12/25.
 */

var Schema = global.mongoose.Schema;

var _Comment = new Schema({
  //video_id: {type: Schema.Types.ObjectId, ref: 'Video' },
  user_id: String,
  parent_comment_id: String,
  title: String,
  comment: String,
  created: {type : Date, default: Date.now},
});

module.exports =  mongoose.model('comment', _Comment);
