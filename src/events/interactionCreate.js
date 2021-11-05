module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        const {
            MessageEmbed
        } = require('discord.js');

        try {
            const Embed = new MessageEmbed()
                .setColor('#FFC300')
                .setTitle(`**Calculating**`)
                .setAuthor('Blackout F1 | Season 8', 'https://i.imgur.com/KlHtdK3.jpg', 'https://bit.ly/BlackoutS8')
                .addField('Calculating', '...', true)
                .setTimestamp()
                .setFooter('Created by Tom', 'https://i.imgur.com/ncL0qpO.png');
            interaction.reply({
                embeds: [Embed]
            }).then(() => command.execute(interaction, client));
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        };
    },
}

// // try {
//     interaction.reply("CALCULATING...").then(() => command.execute(interaction, client));
// // } catch (error) {
//     // console.error(error);
//     // await interaction.reply({ 
//     //     content: 'There was an error while executing this command!',
//     //      ephemeral: true 
//     // });
// // };