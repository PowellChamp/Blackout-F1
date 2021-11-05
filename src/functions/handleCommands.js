const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const clientId = '903335322388135956';
const guildId = '903333128385495110';

module.exports = (client) => {

    client.handleCommands = async (commandFiles, path) => {
        client.commandArray = [];
    
            for (const file of commandFiles) {
                const command = require(`../commands/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
                
        const rest = new REST({ version: '9' }).setToken('OTAzMzM1MzIyMzg4MTM1OTU2.YXrelA.l1gU3rfRw-DYYES-r2eDop5Z4sU');

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
                
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: client.commandArray },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    };
}