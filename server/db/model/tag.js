/**
 * Created by hhu on 2016/1/11.
 */

var Schema = global.mongoose.Schema;

var _Tag = new Schema({
  cat: String,
  tag: String,
  order:Number
});

module.exports =  mongoose.model('tag', _Tag);
