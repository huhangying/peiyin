/**
 * Created by hhu on 2015/12/25.
 */

var _User = new global.mongoose.Schema({
  cell: String,
  name: String,
  password: String,
  created: {type : Date, default: Date.now},
  updated: {type : Date, default: Date.now},
  icon: String,
  gender: String,
  locked_count: Number,
  apply: {type : Boolean, default: true}
});

module.exports =  mongoose.model('user', _User);
