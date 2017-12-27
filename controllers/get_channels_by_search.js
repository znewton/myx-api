const https = require('https');
const querystring = require('query-string');
const API_KEY = process.env.YOUTUBE_API_KEY;

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
      const parsedData = JSON.parse(data);
      if (parsedData.error) {
        response.json({error: parsedData.error});
        return;
      }
      response.json(parsedData.items.map(item => item.snippet));
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}