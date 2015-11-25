angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: '视频片段1',
    lastText: '内容简介1',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: '视频片段2',
    lastText: '内容简介2',
    face: 'img/max.png'
  }, {
    id: 2,
    name: '视频片段3',
    lastText: '内容简介3',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: '视频片段4',
    lastText: '内容简介4!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: '视频片段5',
    lastText: '内容简介5',
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
