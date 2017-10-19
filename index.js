let linksOrSearchQueries = //Put queries or links between the backticks, and run the file, I need to learn how to make GUIs.
`
Rip ROach XXXtentaction
Yung bRatz xxtentacion
`
//I'm dead this is so useful

const YouTube = require('youtube-node');
const youtube = new YouTube();
const fs      = require('fs');
const secure  = require('./secure.json'); // Replace secure.key, and this line
youtube.setKey(secure.key);               // With your youtube API key.
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var YD = new YoutubeMp3Downloader({
   "ffmpegPath": "./ffmpeg.exe", //The single ffmpeg binary location.
   "outputPath": "./Downloads",
   "youtubeVideoQuality": "highest",
   "queueParallelism": 3,
   "progressTimeout": 2000
});

let queries = linksOrSearchQueries.split("\n");
let cleanQueries = []
for(let i = 0;i<queries.length;i++) {
    if(queries[i] != "") cleanQueries.push(queries[i]);
}
if(cleanQueries.length < 1) return console.log("There are no videos to download.");
YD.on("finished", function(err, data) {
    console.log(`Finished downloading: ${data.videoTitle}`);
});
cleanQueries.forEach(query => {
    youtube.search(query, 1, {type: "video"}, async (e, r) => {
        if(!r.items[0]) return console.log(`There was no video for the search: ${query}, skipping it.`);
        songObject = {title: r.items[0].snippet.title, url: r.items[0].id.videoId};
        return new Promise((resolve, reject) => {
            YD.download(songObject.url);
            resolve(songObject.title);
        }).then(title => console.log("Download queued: " + title));
    });
});