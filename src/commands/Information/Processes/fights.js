module.exports = {
	name : 'fights',
	
	execute(interaction, standings) {

		const { MessageEmbed } = require('discord.js');

		const userinfo = interaction.options.getUser('user');
		if (userinfo) {
			var name = userinfo['username']
		} else {
			var name = interaction.user.tag.split("#")[0];
		}

		var user_position = 'unknown'

		totalDrivers = 0
		for (key in standings) {
			totalDrivers ++
		}

		for (key in standings) {
			if (key === name) {
				user_position = standings[key]['position']
				console.log("name: " +name)
				console.log("position: " +user_position) 
			}
		}

		if (user_position > 1) {
			var ahd_position = user_position - 1
		} else {
			var ahd_position = 'N/A'
		}
		if (user_position < totalDrivers) {
			var bhnd_position = parseInt(user_position) + 1
		} else {
			var bhnd_position = 'N/A'
		}

		var champ_fight_names = []
		var champ_fight_teams = []
		var champ_fight_points = []

		if (user_position > 1) {
			for (key in standings) {
				if (standings[key]['position'] == ahd_position) {
					console.log("Ahead: " +standings[key]['position'])
					champ_fight_names.push(`>>> ${key}`);
					champ_fight_teams.push(`>>> ${standings[key]['team']}`);
					champ_fight_points.push(`>>> +${parseInt(standings[key]['points']) - parseInt(standings[name]['points'])}`);
				} else if (standings[key]['position'] === user_position) {
					champ_fight_names.push(`**${key}**`);
					champ_fight_teams.push(`**${standings[key]['team']}**`);
					champ_fight_points.push(`**${standings[key]['points']}**`);
				}
			}
		} else {
			for (key in standings) {
				if (standings[key]['position'] == user_position) {
					champ_fight_names.push(`>>> **${key}**`);
					champ_fight_teams.push(`>>> **${standings[key]['team']}**`);
					champ_fight_points.push(`>>> **${standings[key]['points']}**`);
				}
			}
		}
		if (user_position < totalDrivers) {
			for (key in standings) {
				if (standings[key]['position'] == bhnd_position) {
					champ_fight_names.push(key);
					champ_fight_teams.push(standings[key]['team']);
					champ_fight_points.push(parseInt(standings[key]['points']) - parseInt(standings[name]['points']));
				}
			}
		}

		const exampleEmbed = new MessageEmbed()
			.setColor('#FFC300')
			.setTitle(`**Your Championship Battle**`)
			.setAuthor('Blackout F1 | Season 8', 'https://i.imgur.com/KlHtdK3.jpg', 'https://bit.ly/BlackoutS8')
			.addField('>>> __Driver__', champ_fight_names.join("\n"), true)
			.addField('>>> __Team__', champ_fight_teams.join("\n"), true)
			.addField('>>> __Points__', champ_fight_points.join("\n"), true)
			.setTimestamp()
			.setFooter('Created by Tom', 'https://i.imgur.com/ncL0qpO.png');

		interaction.deleteReply().then(() => interaction.followUp({ embeds: [exampleEmbed] }))

	},
};