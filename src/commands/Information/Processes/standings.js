module.exports = {
	name: 'standings',

	async execute(interaction, standings) {

		console.log("standings: " +standings)

		const fs = require('fs');
		const { MessageEmbed } = require('discord.js');

		const name = interaction.user.tag.split("#");

		// var team = []
		var points = []
		for (value in Object.values(standings)) {
			// team.push(Object.values(standings)[value][0])
			points.push(Object.values(standings)[value])
			};

		console.log(`
Retrieving Standings:
			`)

		console.log("Drivers: " +Object.keys(standings))
		// console.log("Teams: " +team);
		console.log("Points: " +points);
		const exampleEmbed = new MessageEmbed()
			.setColor('#FFC300')
			.setTitle(`**Championship Standings**`)
			.setAuthor('Blackout F1 | Season 8', 'https://i.imgur.com/KlHtdK3.jpg', 'https://bit.ly/BlackoutS8')
			.addField('Driver', Object.keys(standings).join('\n'), true)
			// .addField('Team', team.join('\n'), true)
			.addField('Points', points.join('\n'), true)
			.setTimestamp()
			.setFooter('Created by Tom', 'https://i.imgur.com/ncL0qpO.png');

		interaction.reply({ embeds: [exampleEmbed] });
	},
}
