/// Searches YouTube for a list of channels matching
/// a search term.
exports.get_channels_by_search = function (req, res) {
  console.log('Received request for channel search:');
  console.log(req.query);
  res.json({
    channels: [1, 2, 3]
  });
}

/// Gets the playlists of a given YouTube channel.
exports.get_channel_playlists = function (req, res) {
  console.log('Received request for channel\'s playlists:');
  console.log(req);
  res.json(req);
}

/// Combines the given playlists into a mix.
exports.get_mix = function (req, res) {
  console.log('Received request for mix:');
  console.log(req);
  res.json(req);
}
