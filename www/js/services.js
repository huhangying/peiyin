angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: '地球1小时',
    lastText: '内容简介1',
    url: 'http://101.200.81.99:8080/ciwen/assets/shutdown1h.mp4',
    face: 'img/shutdown1h.JPG'
  }, {
    id: 1,
    name: '长留冰红茶',
    lastText: '内容简介2',
    url: 'http://101.200.81.99:8080/ciwen/assets/icetea.mp4',
    face: 'img/icetea.JPG'
  }, {
    id: 2,
    name: '爱护公物',
    lastText: '内容简介3',
    url: 'http://101.200.81.99:8080/ciwen/assets/takecare.mp4',
    face: 'img/takecare.JPG'
  }, {
    id: 3,
    name: '视频片段4',
    lastText: '内容简介4!',
    url: 'http://101.200.81.99:8080/ciwen/assets/aOrX3hUkGBenBg8OUulHZQ__.mp4',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: '视频片段5',
    lastText: '内容简介5',
    url: 'http://101.200.81.99:8080/ciwen/test2.mp4',
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
