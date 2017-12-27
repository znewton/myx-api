const https = require('https');
const querystring = require('query-string');
const API_KEY = process.env.YOUTUBE_API_KEY;

/// Searches YouTube for a list of channels matching
/// a search term.
exports.get_channels_by_search = 
  require('./controllers/get_channels_by_search')
    .get_channels_by_search;

/// Gets the playlists of a given YouTube channel.
exports.get_channel_playlists = 
  require('./controllers/get_channel_playlists')
    .get_channel_playlists;

/// Combines the given playlists into a mix.
exports.get_mix = 
  require('./controllers/get_mix')
    .get_mix;

exports.get_playlist_names = 
  require('./controllers/get_playlist_names')
    .get_playlist_names;
