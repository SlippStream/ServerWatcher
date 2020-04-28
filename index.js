const Discord = require('discord.js');
const client = new Discord.Client();
const token = "NTk4NTk1NTM3MzkzOTQyNTU5.Xqh5ow.pDZ6p2WBORb38FXMuXqcEGD7GIU";
const https = require('https');

const suffix = "ip=51.161.101.140";
const base_url = "https://mcapi.us/server/status?";
const donate = "https://paypal.me/thiccyZ";

var player = 0, m = "", online = false;
var prefix = "$";
var raw;

client.on('ready', () => {
  console.log("I'm in");
  console.log("as " + client.user.username);
  var channel = client.channels.cache.get("687806600013938688");

  pingServerStatus();
  setInterval(function() {
    console.log("Pinging for data");
    pingServerStatus();

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
      let on = "Offline";
      if (online) {let on = "Online"}
      channel.send("```\nCOVIDCraft\nCurrent Status: " + on + ".\nCurrent Players: " + player + "/" + raw.players.max + "\n" + m + "\n```");}
  }
});

client.on('error', console.error);

function pingServerStatus() {
  https.get(base_url + suffix, (resp) => {
    let data = '';

    resp.on('error', console.error);
    
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      raw = JSON.parse(data);
      player = raw.players.now;
      m = raw.motd;
      online = raw.online;
      console.log("Sending data back... (players: " + player + ", motto: " + m + ")");
    });
  });
}

client.login(token);
