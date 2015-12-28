/**
 * Created by hhu on 2015/12/28.
 */

var _Cat = new global.mongoose.Schema({
  name: String,
  desc: String,
  created: {type : Date, default: Date.now}
});

module.exports =  mongoose.model('category', _Cat);
