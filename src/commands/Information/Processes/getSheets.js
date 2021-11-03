const standings = require('./standings');

module.exports = {
    name: 'getSheets',

    execute(interaction, ext_callback) {
        const fs = require('fs');
        const readline = require('readline');
        const {google} = require('googleapis');

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
            authorize(JSON.parse(content), createStandings);
        });

        function authorize(credentials, callback) {
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

        function createStandings(auth) {
            const sheets = google.sheets({version: 'v4', auth});

            function createDict (team_callback, callback) {
                var standings = {}
                sheets.spreadsheets.values.get({
                spreadsheetId: '1fJmdaoYiMquDwgxFETxv2Ig4A_Qon9lZSsDwnR8malw',
                range: 'Drivers Standings!A2:C',
                }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err);
                    const rows = res.data.values;
                    if (rows.length) {
                        rows.map((row) => {
                            if (row[1] != 'TBA') {
                                if (row[1].endsWith('*')) {
                                    row[1] = row[1].slice(0, row[1].length - 1);
                                }
                                standings[row[1]] = {position: row[0], points: row[2], team: ''};
                                
                            };
                        });


                        team_callback(standings, callback);

                    } else {
                        interaction.reply('No data found.');
                    }

                });
            }

            function addTeamstoDict (standings, callback) {
                sheets.spreadsheets.values.get({
                spreadsheetId: '1fJmdaoYiMquDwgxFETxv2Ig4A_Qon9lZSsDwnR8malw',
                range: 'Drivers/Teams!A3:B',
                }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err);
                    const rows = res.data.values;
                    if (rows.length) {

                        rows.map((row) => {
                            if (row[0] != 'TBA') {
                                if (row[0].endsWith('*')) {
                                    row[0] = row[0].slice(0, row[0].length - 1);
                                }
                                if (row[1].endsWith('*')) {
                                    row[1] = row[1].slice(0, row[1].length - 1);
                                }
                                standings[row[0]].team = row[1]

                            };

                        });

                        callback(standings);
                        
                    } else {
                        interaction.reply('No data found.');
                    }
                
                });
            }
            
            createDict(addTeamstoDict, ext_callback);
        }
    },
}









        // console.log(standings)
        // standings = createStandings();

            // sheets.spreadsheets.values.get({
            //     spreadsheetId: '1fJmdaoYiMquDwgxFETxv2Ig4A_Qon9lZSsDwnR8malw',
            //     range: 'Constructor Standings!A2:C12',
            //     }, (err, res) => {
            //         if (err) return console.log('The API returned an error: ' + err);
            //         const rows = res.data.values;
            //         var constructorStandings = {};
            //         if (rows.length) {

            //             rows.map((row) => {
            //                 if (row[1] != 'TBA') {
            //                     if (row[1].endsWith('*')) {
            //                         row[1] = row[1].slice(0, row[1].length - 1);
            //                     }
            //                     constructorStandings[row[0]] = [row[1], row[2]];
            //                 };
            //             });

            //             // console.log(constructorStandings);

            //         } else {
            //             interaction.reply('No data found.');
            //         }
            // });