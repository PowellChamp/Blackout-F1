const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('f1standings')
		.setDescription('Shows current season standings')
		.addSubcommand(subcommand =>
			subcommand
				.setName('standings')
				.setDescription('Shows current season standings')),

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
		const TOKEN_PATH = './src/sheetsData/token.json';
		
		// Load client secrets from a local file.
		fs.readFile('./src/sheetsData/credentials.json', (err, content) => {
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
			spreadsheetId: '1fJmdaoYiMquDwgxFETxv2Ig4A_Qon9lZSsDwnR8malw',
			range: 'Drivers Standings!B2:C33',
			// majorDimension: 'COLUMNS',
		  }, (err, res) => {
			if (err) return console.log('The API returned an error: ' + err);
			const rows = res.data.values;
			var standings = {};
			if (rows.length) {
				rows.map((row) => {
					if (row[0] != 'TBA') {
					standings[row[0]] = [row[1]];
					}
				});


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
			} else {
				interaction.reply('No data found.');
			}
		  });

		}
	},
};