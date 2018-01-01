const https = require('https');
const querystring = require('query-string');
const shuffle = require('../lib/utils').shuffle;
const API_KEY = process.env.YOUTUBE_API_KEY;

/// Combines the given video ids into a mix.
exports.get_favorites_mix = async function (request, response) {
  console.log('Received request for mix from video ids');
  const videoIds = request.query.videos || [];
  let videos = {};
  
  const params = {
    key: API_KEY,
    part: 'snippet',
    type: 'channel',
    id: videoIds.join(','),
    maxResults: 25
  }
  const options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: `/youtube/v3/videos?${querystring.stringify(params)}`,
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
      const parsedVideos = parsedData.items;
      for (let i = 0; i < parsedVideos.length; i++) {
        videos[parsedVideos[i].id] = parsedVideos[i].snippet;
      }
      response.json({
        orderedVideoIds: shuffle(videoIds),
        videoMap: videos
      });
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}