const { Structures } = require('discord.js');
const fs = require('fs');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const {
  token,
  prefix,
} = require('./config.json');
const https = require('https');

/*const ip = "144.217.199.1";
const port = "25577";
const dynmap_ip = "http://144.217.199.1:8054/index.html";
const base_url = "https://mcapi.us/server/status?ip=";
const donate = "https://paypal.me/thiccyZ";*/
const defaultMaxUsersMentionedInSingleMessage = 3;

var player = 0, m = "", online = false;
var instances = 3;

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.musicData = {
        queue: [],
        isPlaying: false,
        volume: 1,
        songDispatcher: null
      };
    }
  }
  return MusicGuild;
});

const client = new Commando.Client({
  commandPrefix: prefix,
  owner: '350748674969698306',
  unknownCommandResponse: false
});

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['mc', 'Minecraft Command Group'],
    ['dice', 'Dice Command Group'],
    ['music', 'Music Command Group'],
    ['misc', 'Miscellaneous Command Group']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log('Ready!');
});

client.on("message", msg => {
    var content = msg.content;
    var phrase = content.substr(1).split(" ")[0];
    var guild = msg.guild;
    var channel = msg.channel;
    var user = msg.author;
  
  if (msg.content.startsWith(prefix)) {

    //DICE FUNCTIONS:
    //ROLL
    /*else if(content.split(" ")[0].toLowerCase() == "roll" && content.split(" ")[1] != null) {
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
    }*/
    //END DICE FUNCTIONS

  }
  else {
    //MODERATION
    //ROUNDABOUT @EVERYONE
    if ((content.match(/<@/g) || []).length > maxUsersMentionedInSingleMessage) {
      setTimeout(function() {msg.delete()}, Math.random() * 1000);
    };
    //The weird bass thing
    if ((content.match(/<@/g) || []).length > 0 && (user.id == 269226883793551360 || user.id == 269218199298375681 || user.id == 269300710732988416)) {
      instances--;
      if (instances == 0) {
        setTimeout(function() {msg.delete()}, Math.random() * 1000);
        instances = Math.ceil(Math.random() * 3) + 2;
      }
    }
  }
});

client.on('error', console.error);

/*function pingServerStatus() {
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
}*/


client.login(token);
