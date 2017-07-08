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
      response.json(parsedData.items.map(item => item.snippet));
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
  const params = {
    key: API_KEY,
    part: 'snippet',
    type: 'channel',
    channelId: request.params.channelId,
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
      // response.json(parsedData.items.map(item => item.snippet));
      response.json(parsedData.items)
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

function _shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/// Combines the given playlists into a mix.
exports.get_mix = async function (request, response) {
  console.log('Received request for mix:');
  console.log(request.query);
  const playlistIds = request.query.playlists;
  let playlistCalls = [];
  let playlistVideos = {};
  let playlistVideoIds = [];
  for (let i = 0; i < playlistIds.length; i++) {
    const playlistId = playlistIds[i];
    playlistCalls.push(new Promise((resolve, reject) => {
      console.log('Getting videos for ' + playlistId);
      const params = {
        key: API_KEY,
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50
      }
      const options = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: `/youtube/v3/playlistItems?${querystring.stringify(params)}`,
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
          resolve(parsedData.items);
        });
      });
      req.on('error', (e) => {
        reject(e.message);
      });
      req.end();
    }).then(videos => {
      console.log('Got ' + videos.length + ' videos for ' + playlistId);
      for (let i = 0; i < videos.length; i++) {
        playlistVideos[videos[i].id] = videos[i].snippet;
        playlistVideoIds.push(videos[i].id)
      }
    }).catch(error => console.log(error)));
  }
  await Promise.all(playlistCalls);
  console.log('Responding');
  playlistVideoIds = _shuffle(playlistVideoIds)
  response.json({
    orderedVideoIds: playlistVideoIds,
    videoMap: playlistVideos
  });
}
