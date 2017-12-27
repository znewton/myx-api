const https = require('https');
const querystring = require('query-string');
const API_KEY = process.env.YOUTUBE_API_KEY;

exports.get_playlist_names = async function (request, response) {
  console.log('Received request for playlist names.');
  const playlistIds = request.query.playlists;
  console.log(playlistIds);
  let playlists = {}; // {name: string, channel: string}
  
  const params = {
    key: API_KEY,
    part: 'snippet',
    type: 'channel',
    id: playlistIds.join(','),
    maxResults: 25
  }
  const options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: `/youtube/v3/playlists?${querystring.stringify(params)}`,
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
      for(let i = 0; i < parsedData.items.length; i++) {
        let playlist = parsedData.items[i];
        playlists[playlist.id] = {
          name: playlist.snippet.title, 
          channel: playlist.snippet.channelTitle, 
          description: playlist.snippet.description
        };
      }
      response.json(playlists);
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}
