const s1date = "30 June 2020";
const s1down = "https://drive.google.com/drive/folders/1SgIPqSxxXR4mJi5rRLwMlFO39zeLdAnc?usp=sharing";
const { Command } = require('discord.js-commando');

module.exports = class RollCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'oldworld',
			aliases: ['oldw'],
			group: 'mc',
			memberName: 'oldworld',
            description: 'Links the old minecraft server world',
		});
    }
    
    run(message) {
        message.say("The Season 1 world download as of `" + s1date + "`:\n" + s1down);
    }
};