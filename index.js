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
  var topic_channel = client.channels.cache.get("687806600013938688");


  pingServerStatus();
  setInterval(function() {
    console.log("Pinging for data");
    pingServerStatus();

    if (m != "") {
      topic_channel.setTopic(m + " -- Players Online: " + player + " -- Donate: " + donate);
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

    //DICE FUNCTIONS:
    //ROLL
    else if(content.split(" ")[0].toLowerCase() == "roll" && content.split(" ")[1] != null) {
      console.log("starting roll...");
      var arg = content.split(" ")[1].toLowerCase().split("d");
      var numDice, typeDice;
      if (content.split(" ")[1].toLowerCase().substr(0,1) == "d") {
        var numDice = 1;
        var typeDice = arg[0];
      }
      else {
        var numDice = arg[0];
        var typeDice = arg[1];
      }
      var outMsg = "You rolled: ";
      var rolls = "(";
      var total = 0;

      if ((parseInt(numDice) != NaN && numDice >= 0) && (parseInt(typeDice) != NaN && typeDice > 0)) {
        numDice = parseInt(numDice);
        typeDice = parseInt(typeDice);

        if (numDice == 0) numDice = 1;

        var results = roll(numDice, typeDice);

        for (var i = 0; i < results.length; i++) {
          if (i != 0) {rolls += ", ";}
          total += results[i];
          rolls += results[i];
        }
        rolls += ")";

        console.log("Roll successful! Rolled " + total);

        if (numDice == 1) {
          outMsg += results[0] + " ";
          if (typeDice == 20) {
            if (results[0] == 20) {outMsg += "[CRITICAL SUCCESS]";}
            else if (results[0] == 1) {outMsg += "[CRITICAL FAILURE]";}
          }
        }
        else {
          outMsg += total + " " + rolls;
        }
        channel.send(outMsg);
      }
    }
    //END DICE FUNCTIONS

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

function roll(numDice, typeDice) {
  console.log("rolling...");
  var arr = [];
  for (var i = 0; i < numDice; i++) {
    let rand = Math.ceil(Math.random() * typeDice);
    arr.push(rand);
  }
  return arr;
}

client.login(token);
