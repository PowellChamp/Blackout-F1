const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const processes = fs.readdirSync("./src/commands/Information/processes").filter(file => file.endsWith(".js"));
for (file of processes) {
    require(`./Processes/${file}`);
}

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
                .setDescription('Shows championship standings')),

	async execute(interaction, client) {

        const command = require(`./Processes/${interaction.options.getSubcommand()}.js`)

        const standings = await require(`./Processes/getSheets.js`).execute();
        command.execute(interaction, standings);
    }
}