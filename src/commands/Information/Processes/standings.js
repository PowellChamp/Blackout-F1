module.exports = {
	name: 'standings',

	execute(interaction, standings) {

		const fs = require('fs');
		const {
			MessageEmbed
		} = require('discord.js');

		const name = interaction.user.tag.split("#");

		var team = []
		var points = []
		for (value in Object.values(standings)) {
			team.push(Object.values(standings)[value]['team'])
			points.push(Object.values(standings)[value]['points'])
		};

		const exampleEmbed = new MessageEmbed()
			.setColor('#FFC300')
			.setTitle(`**Championship Standings**`)
			.setAuthor('Blackout F1 | Season 8', 'https://i.imgur.com/KlHtdK3.jpg', 'https://bit.ly/BlackoutS8')
			.addField('Driver', Object.keys(standings).join('\n'), true)
			.addField('Team', team.join('\n'), true)
			.addField('Points', points.join('\n'), true)
			.setTimestamp()
			.setFooter('Created by Tom', 'https://i.imgur.com/ncL0qpO.png');

		console.log(exampleEmbed)

		interaction.editReply({
			embeds: [exampleEmbed]
		})

	},
}