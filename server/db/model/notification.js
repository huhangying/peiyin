/**
 * Created by hhu on 2016/1/14.
 */

var _Notification = new global.mongoose.Schema({
  title: String,
  text: String,
  updated: {type : Date, default: Date.now},
});


module.exports =  mongoose.model('notification', _Notification);
