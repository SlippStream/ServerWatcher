const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const token = "NTk4NTk1NTM3MzkzOTQyNTU5.Xqh5ow.pDZ6p2WBORb38FXMuXqcEGD7GIU";
const https = require('https');

const ip = "144.217.199.1";
const port = "25577";
const dynmap_ip = "http://144.217.199.1:8054/index.html";
const base_url = "https://mcapi.us/server/status?ip=";
const donate = "https://paypal.me/thiccyZ";
const s1date = "30 June 2020";
const s1down = "https://drive.google.com/drive/folders/1SgIPqSxxXR4mJi5rRLwMlFO39zeLdAnc?usp=sharing";

const defaultPrefix = "$";
const defaultMaxUsersMentionedInSingleMessage = 3;
const defaultModRole = null;

var player = 0, m = "", online = false;
var prefix, raw, maxUsersMentionedInSingleMessage, modRole;
var serverSettingsObj = [];
var instances = 3;

client.on('ready', () => {
  console.log("I'm in");
  console.log("as " + client.user.username);
  
  readServerDataIntoMemory();

  setInterval(function() {writeServerDataFromMemory()}, 600000);

  //pingServerStatus();
  /*setInterval(function() {
    console.log("Pinging for data");
    pingServerStatus();

    if (m != "") {
      topic_channel.setTopic(m + " -- Players Online: " + player + " -- Donate: " + donate);
      console.log("Updated channel topic");
    }
}, 20000);*/
});

client.on("message", msg => {
    var content = msg.content;
    var phrase = content.substr(1).split(" ")[0];
    var firstChar = content.substr(0,1);
    var guild = msg.guild;
    var channel = msg.channel;
    var user = msg.author;

    getServerSettings(guild);
  
  if (msg.content.substr(0,1) == prefix) {

    // DONATE
    if (phrase.toLowerCase() == "donate") {channel.send("You can support the upkeep of COVIDCraft by donating here: " + donate);}
    
    //STATUS
    else if (phrase.toLowerCase() == "status") {
      let on = "Offline";
      if (raw.online) {on = "Online"}
      channel.send("```\nCOVIDCraft -- " + m + "\nCurrent Status: " + on + ".\nCurrent Players: " + player + "/" + raw.players.max + "\n```");}
    //IP
    else if (phrase.toLowerCase() == "ip") {
      channel.send("The IP for this server is `" + ip + ":" + port + "`\nThe Dynmap can be found at " + dynmap_ip);
    }
    //HELP
    else if (phrase.toLowerCase() == "help") {
      channel.send("```\n" + prefix + "donate - Sends a donate link to support the server.\n" + prefix + "status - Display server status, including player count and whether the server is down.\n" + prefix + "ip - Sends the server ip and dynmap address.```")
    }
    else if (phrase.toLowerCase() == "oldworld") {
        channel.send("The Season 1 world download as of `" + s1date + "`:\n" + s1down);
    }
    //FORCE SERVER SETTINGS WRITE (MODS ONLY)
    else if (phrase.toLowerCase() == "forcesave" && user.roles.indexOf(modRole) != -1) {
      writeServerDataFromMemory();
      channel.send("Data written!");
    }
    //SET MOD ROLE (SINGLE USE)
    else if (phrase.toLowerCase() == "setmodrole" && modRole == null) {
      var p = content.substr(content.indexOf("\"") + 1, content.lastIndexOf("\"") - 1);
      if (getRoleFromName(guild, p) != null) {
        channel.send("New mod role set: `" + p + "`");
        console.log("New mod role set: `" + p + "`");
        modRole = getRoleFromName(p);
        writeServerDataFromMemory();
      }
      else {
        channel.send("Role name not found");
      }
    }

    //DICE FUNCTIONS:
    //ROLL
    else if(content.split(" ")[0].toLowerCase() == "roll" && content.split(" ")[1] != null) {
      console.log("starting roll...");
      var arg = phrase.split(" ")[1].toLowerCase().split("d");
      var numDice, typeDice;
      var outMsg = "You rolled: ";
      var rolls = "(";
      var total = 0;

      if (phrase.split(" ")[1].toLowerCase().substr(0,1) == "d") {
        var numDice = 1;
        var typeDice = arg[1];
      }
      else {
        var numDice = arg[0];
        var typeDice = arg[1];
      }



      if ((parseInt(numDice) != NaN && numDice > 0) && (parseInt(typeDice) != NaN && typeDice > 0)) {
        numDice = parseInt(numDice);
        typeDice = parseInt(typeDice);

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
  else {
    //MODERATION
    //ROUNDABOUT @EVERYONE
    if ((content.match(/<@/g) || []).length > maxUsersMentionedInSingleMessage) {
      setTimeout(function() {msg.delete()}, Math.random() * 1000);
    };
    if (user.id == 269226883793551360 || user.id == 269218199298375681 || user.id == 269300710732988416) {
      instances--;
      if (instances == 0) {
        setTimeout(function() {msg.delete()}, Math.random() * 1000);
        instances = Math.ceil(Math.random() * 3) + 2;
      }
    }
  }
});

client.on('error', console.error);

function pingServerStatus() {
  https.get(base_url + ip + "&port=" + port, (resp) => {
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

function getServerSettings(guildID) {
  if (getServerIndex(guildID) != -1) {
    var server = serverSettingsObj[getServerIndex(guildID)];
    this.prefix = server.prefix;
    this.maxUsersMentionedInSingleMessage = server.maxUsersMentionedInSingleMessage;
    this.modRole = server.modRole;
  }
  else addDefaultDataForServer(guildID);
}

function getServerIndex(guildID) {
  var index = -1;
  for (var i = 0; i < serverSettingsObj.length; i++) {
    if (serverSettingsObj[i].guildID == guildID) index = i;
  }
  return index;
}

function addDefaultDataForServer(guildID) {
  if (getServerIndex(guildID) == -1) {
    serverSettingsObj.push({
      "guildID": guildID,
      "prefix": defaultPrefix,
      "maxUsersMentionedInSingleMessage": defaultMaxUsersMentionedInSingleMessage,
      "modRole": defaultModRole
    });
  }
  writeServerDataFromMemory();
}

function readServerDataIntoMemory() {
  fs.readFileSync('serverData/guildVariables.json', function(err, data) {
    if (err) return console.error(err);
    else {
      serverSettingsObj = JSON.parse(data);
      return console.log("Server settings read into memory")
    }
  })
}

function getRoleFromName(guildID, name) {
  var guild = client.guilds.cache.get(guildID);
  guild.roles.cache.find(role => role.name == name);
  return role;
}

function writeServerDataFromMemory() {
  fs.writeFile('serverData/guildVariables.json', serverSettingsObj, function() {
    return console.log("Server data written to drive");
  });
}

client.login(token);
