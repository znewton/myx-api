module.exports = function(app) {
  var controller = require('./controller.js');

  // Routes
  app.route('/channels')
    .get(controller.get_channels_by_search);

  app.route('/playlists/:channelId')
    .get(controller.get_channel_playlists);

  app.route('/mix')
    .get(controller.get_mix);
};
