const https = require('https');
const querystring = require('query-string');
const shuffle = require('../lib/utils').shuffle;
const API_KEY = process.env.YOUTUBE_API_KEY;

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
          if (!parsedData || !parsedData.items) {
            console.log('Error when getting videos for ' + playlistId);
            console.log('Received:', parsedData);
            reject('Error retrieving videos for ' + playlistId);
          }
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
  playlistVideoIds = shuffle(playlistVideoIds)
  response.json({
    orderedVideoIds: playlistVideoIds,
    videoMap: playlistVideos
  });
}