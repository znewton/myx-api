getChannelsDocs();
getPlaylistsDocs();
getMixDocs();


function getChannelsDocs() {
  var paramsElement = document.getElementById('get_channels_params');
  var resultsElement = document.getElementById('get_channels_results');
  paramsElement.innerHTML = syntaxHighlight({
    q: 'Channel Name'
  });
  resultsElement.innerHTML = syntaxHighlight([
    {
      publishedAt: "yyyy-mm-ddThh:mm:ss.000Z",
      channelId: "lsjdfljsdflgjdflglksjfglk",
      title: "Channel Title",
      description: "Description of Channel",
      thumbnails: {
        default: {
          url: "https://yt3.ggpht.com/url/of/default/thumbnail/photo.jpg"
        },
        medium: {
          url: "https://yt3.ggpht.com/url/of/medium/thumbnail/photo.jpg"
        },
        high: {
          url: "https://yt3.ggpht.com/url/of/high/thumbnail/photo.jpg"
        }
      },
      channelTitle: 'Channel Title',
      liveBroadcastContent: "upcoming/none/..."
    }
  ]);
}

function getPlaylistsDocs() {
  var paramsElement = document.getElementById('get_playlist_params');
  var resultsElement = document.getElementById('get_playlist_results');
  // paramsElement = syntaxHighlight({null});
  paramsElement.parentElement.style.display = 'none';
  resultsElement.innerHTML = syntaxHighlight([
    {
      kind: "youtube#playlist",
      etag: "\"sjfglksjdfgjfdskf/sojfgldsjfgljf\"",
      id: "sdfljsdfghjkhdfghsdkjfgh",
      snippet: {
        publishedAt: "yyyy-mm-ddThh:mm:ss.000Z",
        channelId: "wiuehrgiwegjsdfjhilsdfhj",
        title: "Playlist Title",
        description: "Description of playlist",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/urlof/default.jpg",
            width: 120,
            height: 90
          },
          medium: {
            url: "https://i.ytimg.com/vi/urlof/medium.jpg",
            width: 320,
            height: 180
          },
          high: {
            url: "https://i.ytimg.com/vi/urlof/high.jpg",
            width: 480,
            height: 360
          },
          standard: {
            url: "https://i.ytimg.com/vi/urlof/standard.jpg",
            width: 640,
            height: 480
          },
          maxres: {
            url: "https://i.ytimg.com/vi/urlof/maxres.jpg",
            width: 1280,
            height: 720
          }
        },
        channelTitle: "Channel Title",
        localized: {
          title: "Playlist Title",
          description: "Description of playlist"
        }
      }
    }
  ])
}

function getMixDocs() {
  var paramsElement = document.getElementById('get_mix_params');
  var resultsElement = document.getElementById('get_mix_results');
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
       json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/[0-9]+/.test(match)) {
        cls = 'number';
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
}
