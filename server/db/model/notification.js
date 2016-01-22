/**
 * Created by hhu on 2016/1/14.
 */
var Schema = global.mongoose.Schema;
var _Notification = new Schema({
  to: {type: Schema.Types.ObjectId},
  title: String,
  text: String,
  updated: {type : Date, default: Date.now},
  viewed: {type: Boolean, default: false},
});


module.exports =  mongoose.model('notification', _Notification);
