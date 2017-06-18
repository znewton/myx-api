const https = require('https');
const querystring = require('query-string');
const API_KEY = 'AIzaSyBB0cENZdGYDoSn1H0cRmwJ-KsjdIMaWAA';

/// Searches YouTube for a list of channels matching
/// a search term.
exports.get_channels_by_search = function (request, response) {
  console.log('Received request for channel search:');
  console.log(request.query);
  const params = {
    key: API_KEY,
    part: 'snippet',
    type: 'channel',
    q: request.query.q,
    maxResults: 25
  }
  const options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: `/youtube/v3/search?${querystring.stringify(params)}`,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    let data = ''
    res.setEncoding('utf8');
    res.on('data', (d) => {
      data += d
    });
    res.on('end', () => {
      const parsedData = JSON.parse(data)
      response.json(parsedData.items)
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

/// Gets the playlists of a given YouTube channel.
exports.get_channel_playlists = function (request, response) {
  console.log('Received request for channel\'s playlists:');
  console.log(request.params);
  response.json({
    result: 'success!'
  });
}

/// Combines the given playlists into a mix.
exports.get_mix = function (request, response) {
  console.log('Received request for mix:');
  console.log(request);
  response.json(request);
}
