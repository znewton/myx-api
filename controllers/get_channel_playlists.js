const https = require('https');
const querystring = require('query-string');
const API_KEY = process.env.YOUTUBE_API_KEY;

/// Gets the playlists of a given YouTube channel.
exports.get_channel_playlists = function (request, response) {
  console.log('Received request for channel\'s playlists:');
  console.log(request.params);
  const playlistParams = {
    key: API_KEY,
    part: 'snippet',
    type: 'channel',
    channelId: request.params.channelId,
    maxResults: 25
  };
  const channelParams = {
    key: API_KEY,
    part: 'snippet,contentDetails',
    id: request.params.channelId
  };
  const options = (type) => { 
    const params = {
      playlist: playlistParams,
      channel: channelParams
    };
    return {
      hostname: 'www.googleapis.com',
      port: 443,
      path: `/youtube/v3/${type+'s'}?${querystring.stringify(params[type])}`,
      method: 'GET'
    };
  };

  const channelReq = https.request(options('channel'), (channelRes) => {
    let data = '';
    channelRes.setEncoding('utf8');
    channelRes.on('data', (d) => {
      data += d;
    });
    channelRes.on('end', () => {
      const parsedChannelData = JSON.parse(data);
      if (parsedChannelData.error) {
        response.json({error: parsedChannelData.error});
        return;
      }
      const channel = parsedChannelData.items[0];
      console.log(channel);
      const playlistReq = https.request(options('playlist'), (playlistRes) => {
        let data = '';
        playlistRes.setEncoding('utf8');
        playlistRes.on('data', (d) => {
          data += d;
        });
        playlistRes.on('end', () => {
          const parsedPLData = JSON.parse(data);
          if (parsedPLData.error) {
            response.json({error: parsedPLData.error});
            return;
          }
          const uploads = {
            id: channel.contentDetails.relatedPlaylists.uploads,
            snippet: {
              title: "Uploads",
              description: "",
              channelId: channel.id,
              channelTitle: channel.snippet.title,
              localized: {
                title: "Uploads",
                description: "All channel uploads"
              }
            }
          };
          let playlists = parsedPLData.items;
          playlists.unshift(uploads);
          response.json({
            playlists: parsedPLData.items
          });
        });
      });
      playlistReq.on('error', (e) => {
        console.error(e);
      });
      playlistReq.end();
    });
  });
  channelReq.on('error', (e) => {
    console.error(e);
  });
  channelReq.end();
};