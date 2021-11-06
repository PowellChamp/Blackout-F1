const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { Message } = require('discord.js');
const fs = require('fs');
const { file } = require('googleapis/build/src/apis/file');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('f1')
        .setDescription('Blackout F1 Commands')
        .addSubcommand(subcommand =>
            subcommand
            .setName('stats')
            .setDescription('Shows user stats')
            .addUserOption(option => option.setName('user').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
            .setName('fights')
            .setDescription('Shows user championship fights')
            .addUserOption(option => option.setName('user').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
            .setName('standings')
            .setDescription('Shows championship standings'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('createrace')
            .setDescription('Create a race event invite.')
            .addStringOption(option => option.setName('title').setDescription('Title for the Race Event'))
            .addStringOption(option => option.setName('date').setDescription('Format: dd/mm/yy'))
            .addStringOption(option => option.setName('time').setDescription('Format: hh:mm'))),

    async execute(interaction, client) {

        if ( interaction.user.tag.split('#')[0] === 'Millo' ) {
            client.users.fetch('328488975604121602').then((user) => {
                user.send('https://c.tenor.com/09uldTF_OnIAAAAd/squirrel-dancing-squirrel.gif')
            })
        }

        InformationCommands = fs.readdirSync("./src/commands/Information/Processes").filter(file => file.endsWith('.js'));
        ModerationCommands = fs.readdirSync("./src/commands/Moderation/Processes").filter(file => file.endsWith('.js'));

        getSheets = require(`./Information/Processes/getSheets.js`);

        console.log(`${interaction.user.tag} ran /${interaction.commandName} ${interaction.options.getSubcommand()} ${interaction.options.getUser()}`)

        for (var file of InformationCommands) {
            if (interaction.options.getSubcommand() === file.split(".")[0].toLowerCase()) {
                const command = require(`./Information/Processes/${interaction.options.getSubcommand()}.js`)
                getSheets.execute(interaction, (s) => {
                    command.execute(interaction, s);
                })
            }
        }

        for (var file of ModerationCommands) {
            if (interaction.options.getSubcommand() === file.split(".")[0].toLowerCase()) {
                const command = require(`./Moderation/Processes/${interaction.options.getSubcommand()}.js`)
                command.execute(interaction, client);
            }
        }
    }
}