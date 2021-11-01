// const fs = require('fs');
// const { Client, Collection, Intents } = require('discord.js');
// const { token } = require('./config.json');

// const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// client.commands = new Collection();
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
// 	const command = require(`./commands/${file}`);
// 	client.commands.set(command.data.name, command);
// }

// client.once('ready', () => {
// 	console.log('Ready!');
// });

// client.on('interactionCreate', async interaction => {
// 	if (!interaction.isCommand()) return;

// 	const command = client.commands.get(interaction.commandName);

// 	if (!command) return;

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 	}
// });

// client.login(token);

const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config();

client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventsFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventsFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login('OTAzMzM1MzIyMzg4MTM1OTU2.YXrelA.l1gU3rfRw-DYYES-r2eDop5Z4sU');
})();