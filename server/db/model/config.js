/**
 * Created by hhu on 2015/12/25.
 */



var _Config = new global.mongoose.Schema({
  name: String,
  value: String,
  updated: {type : Date, default: Date.now},
});


module.exports =  mongoose.model('config', _Config);


