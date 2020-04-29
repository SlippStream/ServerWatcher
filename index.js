const Discord = require('discord.js');
const client = new Discord.Client();
const token = "NTk4NTk1NTM3MzkzOTQyNTU5.Xqh5ow.pDZ6p2WBORb38FXMuXqcEGD7GIU";
const https = require('https');

const ip = "51.161.101.140";
const dynmap_ip = "http://51.161.101.140:8196/index.html";
const base_url = "https://mcapi.us/server/status?ip=";
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

    // DONATE
    if (content.toLowerCase() == "donate") {channel.send("You can support the upkeep of COVIDCraft by donating here: " + donate);}
    //STATUS
    else if (content.toLowerCase() == "status") {
      let on = "Offline";
      if (raw.online) {on = "Online"}
      channel.send("```\nCOVIDCraft -- " + m + "\nCurrent Status: " + on + ".\nCurrent Players: " + player + "/" + raw.players.max + "\n```");}
    //IP
    else if (content.toLowerCase() == "ip") {
      channel.send("The IP for this server is `" + ip + "`\nThe Dynmap can be found at " + dynmap_ip);
    }
    //HELP
    else if (content.toLowerCase() == "help") {
      channel.send("```\n" + prefix + "donate - Sends a donate link to support the server.\n" + prefix + "status - Display server status, including player count and whether the server is down.\n" + prefix + "ip - Sends the server ip and dynmap address.```")
    }
  }
  else if (msg.content == "<@" + client.user.id + ">") {msg.channel.send("My prefix is `" + prefix + "`");}
});

client.on('error', console.error);

function pingServerStatus() {
  https.get(base_url + ip, (resp) => {
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
