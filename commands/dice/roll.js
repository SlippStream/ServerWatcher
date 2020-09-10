const { Command } = require('discord.js-commando');

module.exports = class RollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roll',
			aliases: ['roll-dice', 'r'],
			group: 'dice',
			memberName: 'roll',
            description: 'Rolls a specified amount and type of dice.',
            args: [
                {
                    key: 'text',
                    prompt: 'What dice need to be rolled and how many? (XdY)',
                    type: 'string'
                },
            ],
		});
    }
    
    run(message, { text }) {
        console.log("starting roll...");
      var arg = text.split(" ")[1].toLowerCase().split("d");
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
        return message.say(outMsg);
      }
    }

    roll(numDice, typeDice) {
        console.log("rolling...");
        var arr = [];
        for (var i = 0; i < numDice; i++) {
          let rand = Math.ceil(Math.random() * typeDice);
          arr.push(rand);
        }
        return arr;
      }
};