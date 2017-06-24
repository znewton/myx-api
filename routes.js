const express = require('express');
const path = require('path');

module.exports = function(app) {
  var controller = require('./controller.js');
  // serve static assets normally
  app.use(express.static(__dirname + '/'));

  // Routes
  app.route('/')
    .get((req, res) => {
      res.sendFile(path.resolve(__dirname, '/', 'index.html'))
    })
  app.route('/channels')
    .get(controller.get_channels_by_search);

  app.route('/playlists/:channelId')
    .get(controller.get_channel_playlists);

  app.route('/mix')
    .get(controller.get_mix);
};
