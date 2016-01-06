/**
 * Created by hhu on 2015/12/30.
 */

var Schema = global.mongoose.Schema;
var _Interest = new Schema({
  uid: {type: Schema.Types.ObjectId, ref: 'user'},
  interests: [{type: Schema.Types.ObjectId, ref: 'user' }]
});

module.exports =  mongoose.model('interest', _Interest);
