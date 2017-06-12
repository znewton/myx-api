/// Searches youtube for a list of channels matching
/// a search term.
exports.get_channels_by_search = function (req, res) {
  console.log('Received request for channel search:');
  console.log(req);
  res.json(req);
}
