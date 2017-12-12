let linksOrSearchQueries = //Put queries or links between the backticks, and run the file. Also supports soundcloud links, but not searches.
`
https://www.youtube.com/watch?v=BnANUza_uXQ
`

const sc = require ('soundcloud-dl');
const request = require('request-promise')
const YouTube = require('youtube-node');
const youtube = new YouTube();
const fs      = require('fs');
const secure  = require('./secure.json'); // Be sure to add your YouTube API Key to ./secure.json.
youtube.setKey(secure.youtubeAPIKey);
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

var YD = new YoutubeMp3Downloader({
   "ffmpegPath": "./ffmpeg.exe", //The single ffmpeg binary location.
   "outputPath": "./Downloads",
   "youtubeVideoQuality": "highest",
   "queueParallelism": 3,
   "progressTimeout": 2000
});
let queries = linksOrSearchQueries.split("\n");
let youtubeCleanQueries = [];
let soundcloudQueries = [];
for(let i = 0; i<queries.length; i++) {
    if(queries[i] != "") {
        queries[i].toLowerCase().indexOf('soundcloud') > -1 ? soundcloudQueries.push(queries[i]) : youtubeCleanQueries.push(queries[i]);
    }
}

if(youtubeCleanQueries.length < 1 && soundcloudQueries.length < 1) return console.log("There are no videos to download.");

YD.on("finished", function(err, data) {
    console.log(`Finished downloading: ${data.videoTitle}`);
});

youtubeCleanQueries.forEach(query => {
    youtube.search(query, 1, {type: "video"}, async (e, r) => {
        if(!r.items[0]) return console.log(`There was no video for the search: ${query}, skipping it.`);
        songObject = {title: r.items[0].snippet.title, url: r.items[0].id.videoId};
        return new Promise((resolve, reject) => {
            YD.download(songObject.url);
            resolve(songObject.title);
        }).then(title => console.log(`Download queued: ${title}`));
    });
});

soundcloudQueries.forEach(query => {
    sc.getSongDlByURL(query).then((song) => {
        request(song.http_mp3_128_url).pipe(
            fs.createWriteStream(`./Downloads/${query.replace(/soundcloud|.com|https|[/\\?:=]/gi, '').replace('-', ' ')}.mp3`)
            .on('finish', () => {console.log(`Finished downloading: ${query}`)})
        );
    });
    console.log(`Download queued: ${query.substring(0, 30)}...`);
})