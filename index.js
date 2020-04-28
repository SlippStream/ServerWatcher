const Discord = require('discord.js');
const client = new Discord.Client();
const token = "NTk4NTk1NTM3MzkzOTQyNTU5.Xqh5ow.pDZ6p2WBORb38FXMuXqcEGD7GIU";
const https = require('https');
const fs = require('fs');
const request = require('request');

const suffix = "ip=51.161.101.140";
const base_url = "https://mcapi.us/server/";
const donate = "https://paypal.me/thiccyZ";

var player = 0, m = "";
var prefix = "$";

client.on('ready', () => {
  console.log("I'm in");
  console.log("as " + client.user.username);
  var channel = client.channels.cache.get("687806600013938688");

  http();
  setInterval(function() {
    console.log("Pinging for data");
    http();

    if (m != "") {
      channel.setTopic(m + " -- Players Online: " + player + " -- Donate: " + donate);
      console.log("Updated channel topic");
    }
}, 20000);
});

client.on("message", msg => {
  if (msg.content.substr(0,1) == prefix) {
    var content = msg.content.substr(1);
    var channel = msg.channel;
    var user = msg.author;

    if (content == "donate") {channel.send("You can support the upkeep of COVIDCraft by donating here: " + donate);}
    else if (content == "status") {
      var statusFile = fs.createWriteStream('img.png');
      await new Promise((resolve, reject) => {
        let stream = request({
          uri: 'http://mcapi.us/server/image?ip=51.161.101.140&theme=dark&title=COVIDCraft',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
            'DNT': '1'
          },
          gzip: true
        })
        .pipe(statusFile)
        .on('finish', () => {
          console.log('The file is finished downloading.');
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        })
      })
      .catch(error => {
        console.log("Error: ${error}");
      });
      fs.close(statusFile);
      channel.send("", {files: ["./img.png"]});}
  }
});

client.on('error', console.error);

function http() {
  https.get("https://mcapi.us/server/status?" + suffix, (resp) => {
    let data = '';

    resp.on('error', console.error);
    
    resp.on('data', (chunk) => {
      data += chunk;
      console.log("Received data");
    });

    resp.on('end', () => {
      let raw = JSON.parse(data);
      player = raw.players.now;
      m = raw.motd;
      console.log("Sending data back... (players " + player + " motto " + m + ")");
    });
  });
}

client.login(token);
