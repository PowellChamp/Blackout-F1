const { SlashCommandBuilder } = require('@discordjs/builders');

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

	async execute(interaction) {
        
    }
}