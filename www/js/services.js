angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: '地球1小时',
    lastText: '内容简介1',
    url: 'http://101.200.81.99:8080/ciwen/assets/shutdown1h.mp4',
    file_no_ext: 'shutdown1h',
    face: 'img/shutdown1h.JPG'
  }, {
    id: 1,
    name: '长留冰红茶',
    lastText: '内容简介2',
    url: 'http://101.200.81.99:8080/ciwen/assets/icetea.mp4',
    file_no_ext: 'icetea',
    face: 'img/icetea.JPG'
  }, {
    id: 2,
    name: '爱护公物',
    lastText: '内容简介3',
    url: 'http://101.200.81.99:8080/ciwen/assets/takecare.mp4',
    file_no_ext: 'takecare',
    face: 'img/takecare.JPG'
  }, {
    id: 3,
    name: '花千骨2015 MV',
    lastText: '内容简介4!',
    url: 'http://101.200.81.99:8080/ciwen/assets/mv_hjg.mp4',
    file_no_ext: 'mv_hjg',
    face: 'img/mv_hqg.jpg'
  }, {
    id: 4,
    name: '花千骨2015 MV 片段',
    lastText: '内容简介5',
    url: 'http://101.200.81.99:8080/ciwen/assets/mvtest.mp4',
    file_no_ext: 'mvtest',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
