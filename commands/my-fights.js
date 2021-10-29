const { SlashCommandBuilder } = require('@discordjs/builders');
const standings = require('./standings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('myf1fights')
		.setDescription('Shows your current season championship fights'),
	async execute(interaction) {
		const fs = require('fs');
		const readline = require('readline');
		const {google} = require('googleapis');
		const { MessageEmbed } = require('discord.js');
		
		// If modifying these scopes, delete token.json.
		const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
		// The file token.json stores the user's access and refresh tokens, and is
		// created automatically when the authorization flow completes for the first
		// time.
		const TOKEN_PATH = 'token.json';
		
		// Load client secrets from a local file.
		fs.readFile('credentials.json', (err, content) => {
		  if (err) return console.log('Error loading client secret file:', err);
		  // Authorize a client with credentials, then call the Google Sheets API.
		  authorize(JSON.parse(content), listMajors);
		});
		
		/**
		 * Create an OAuth2 client with the given credentials, and then execute the
		 * given callback function.
		 * @param {Object} credentials The authorization client credentials.
		 * @param {function} callback The callback to call with the authorized client.
		 */
		async function authorize(credentials, callback) {
		  const {client_secret, client_id, redirect_uris} = credentials.installed;
		  const oAuth2Client = new google.auth.OAuth2(
			  client_id, client_secret, redirect_uris[0]);
		
		  // Check if we have previously stored a token.
		  fs.readFile(TOKEN_PATH, (err, token) => {
			if (err) return getNewToken(oAuth2Client, callback);
			oAuth2Client.setCredentials(JSON.parse(token));
			callback(oAuth2Client);
		  });
		}
		
		/**
		 * Prints the names and majors of students in a sample spreadsheet:
		 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
		 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
		 */
		async function listMajors(auth) {
		  const sheets = google.sheets({version: 'v4', auth});
		  sheets.spreadsheets.values.get({
			spreadsheetId: '1Q6FYVvN3cU3pQX_vYFZuJOm2jdFpQR-sDf9aWvnxqwY',
			range: 'RESULTS!A3:AC10',
		  }, (err, res) => {
			if (err) return console.log('The API returned an error: ' + err);
			const rows = res.data.values;
			var standings = {};
			if (rows.length) {
				const name = interaction.user.tag.split("#")[0];
				var position = 1
				rows.map((row) => {
					standings[position] = [row[0], row[1], row[28]];
					position ++
				});

				console.log(standings)
				console.log(name)
				var user_position = 'unknown'

				for (key in standings) {
					if (standings[key][0] === name) {
						console.log(standings[key][0])
						user_position = key
					}
				}
				if (user_position > 1) {
					var ahd_position = user_position - 1
					console.log(ahd_position)
				} else {
					var ahd_position = 'N/A'
				}

				console.log(typeof user_position)

				if (user_position < 8) {
					var bhnd_position = parseInt(user_position) + 1
					console.log(bhnd_position)
				} else {
					var bhnd_position = 'N/A'
				}

				var champ_fight_names = []
				var champ_fight_teams = []
				var champ_fight_points = []

				if (user_position > 1) {
				champ_fight_names.push(`>>> ${standings[ahd_position][0]}`);
				champ_fight_teams.push(`>>> ${standings[ahd_position][1]}`);
				champ_fight_points.push(`>>> +${parseInt(standings[ahd_position][2]) - parseInt(standings[user_position][2])}`);
				champ_fight_names.push(`**${standings[user_position][0]}**`);
				champ_fight_teams.push(`**${standings[user_position][1]}**`);
				champ_fight_points.push(`**${standings[user_position][2]}**`);
				} else {
				champ_fight_names.push(`>>> **${standings[user_position][0]}**`);
				champ_fight_teams.push(`>>> **${standings[user_position][1]}**`);
				champ_fight_points.push(`>>> **${standings[user_position][2]}**`);
				}

				if (user_position < 8) {
				champ_fight_names.push(standings[bhnd_position][0]);
				champ_fight_teams.push(standings[bhnd_position][1]);
				champ_fight_points.push(parseInt(standings[bhnd_position][2]) - parseInt(standings[user_position][2]));
				}

				console.log(user_position)
				console.log(champ_fight_names)
				console.log(champ_fight_points)

				const exampleEmbed = new MessageEmbed()
					.setColor('#FFC300')
					.setTitle(`**Your Championship Battle**`)
					.setAuthor('Blackout F1 | Season 8', 'https://i.imgur.com/KlHtdK3.jpg', 'https://bit.ly/BlackoutS8')
					.addField('>>> __Driver__', champ_fight_names.join("\n"), true)
					// .addField('Team', Object.keys(standings).find(key => standings[key] === name), true)
					.addField('>>> __Team__', champ_fight_teams.join("\n"), true)
					.addField('>>> __Points__', champ_fight_points.join("\n"), true)
					.setTimestamp()
					.setFooter('Created by Tom', 'https://i.imgur.com/ncL0qpO.png');

				interaction.reply({ embeds: [exampleEmbed] });

			} else {
				interaction.reply('No data found.');
			}
		  });
		}
	},
};