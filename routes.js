module.exports = function(app) {
  var controller = require('../controller.js');

  // Routes
  app.route('/search')
    .get(controller.get_channels_by_search);


  app.route('/mix/:mixId')
    .get(controller.get_mix)
    .put(controller.update_mix)
    .delete(controller.delete_mix);
};
