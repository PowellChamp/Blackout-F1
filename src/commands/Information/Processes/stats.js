module.exports = {
	name : 'stats',

	execute(interaction, standings) {

		const userinfo = interaction.options.getUser('user');
		if (userinfo) {
			var name = userinfo['username']
		} else {
			var name = interaction.user.tag.split("#")[0];
		}
		
		if (!(Object.keys(standings).includes(name))) {
			interaction.deleteReply().then(() => interaction.followUp("User not found."))
			return
		};

		console.log("Name = " +name)

		const { MessageEmbed } = require('discord.js');

		const exampleEmbed = new MessageEmbed()
			.setColor('#FFC300')
			.setTitle(`**${name}'s Stats**`)
			.setAuthor('Blackout F1 | Season 8', 'https://i.imgur.com/KlHtdK3.jpg', 'https://bit.ly/BlackoutS8')
			.addFields(
				{ name: 'Team', value: `${standings[name]['team']}`, inline: true },
				{ name: 'Total Points', value: `${standings[name]['points']}`, inline: true },
				// { name: 'Penalty Points', value: `${standings[name][]}` },
			)
			.setTimestamp()
			.setFooter('Created by Tom', 'https://i.imgur.com/ncL0qpO.png');
						
		interaction.deleteReply().then(() => interaction.followUp({ embeds: [exampleEmbed] }))
	},
};