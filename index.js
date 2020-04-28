const Discord = require('discord.js');
const client = new Discord.Client();
const token = "NTk4NTk1NTM3MzkzOTQyNTU5.Xqh5ow.pDZ6p2WBORb38FXMuXqcEGD7GIU";
const https = require('https');

const suffix = "ip=51.161.101.140";
const base_url = "https://mcapi.us/server/";
const donate = "https://paypal.me/thiccyZ";

var player = 0, m = "";

client.login(token);
client.on('ready', () => {
  console.log("I'm in");
  console.log("as " + client.user.username);

  setInterval(function() {
    http();

    var channel = client.channels.cache.get("687806600013938688");
    channel.setTopic(m + " -- Players Online: " + player + " -- Donate: " + donate);
}, 20000);
});

function http() {
  https.get("https://mcapi.us/server/status?" + suffix, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let raw = JSON.parse(data);
      player = raw.players.now;
      m = raw.motd;
    });
  });
}

client.login(token);
