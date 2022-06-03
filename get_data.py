from __future__ import print_function

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

class get_data:
    def __init__(self, SPREADSHEET_ID):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        service = build('sheets', 'v4', credentials=creds)
        self.sheet = service.spreadsheets()
        self.SPREADSHEET_ID = SPREADSHEET_ID

    def read(self, RANGE_NAME):
        try:
            # Call the Sheets API
            result = self.sheet.values().get(spreadsheetId=self.SPREADSHEET_ID, range=RANGE_NAME).execute()
            values = result.get('values', [])

            if not values:
                print('No data found.')
                return
            
            return values
        except HttpError as err:
            print(err)

    def driver_info(self):
        driverinfo = {}
        drivertoteam = self.read("Race Results!A3:AD")
        drivers = self.read("Drivers Standings!A2:C")
        constructors = self.read("Constructor Standings!A2:C")
        for i in drivertoteam:
            if i == []:
                continue
            if i[0] != "TBA" or i[0] == '':
                driverinfo[i[0]] = {"Team": i[1]}

                wins = 0
                podiums = 0
                for r in i[4:]:
                    if r == "x": continue
                    if int(r) <= 3 & int(r): podiums += 1
                    if int(r) == 1: wins += 1
                driverinfo[i[0]]['Wins'] = wins
                driverinfo[i[0]]['Podiums'] = podiums

        for i in drivers:
            if i[1] != "TBA":
                driverinfo[i[1]]['Position'], driverinfo[i[1]]['Points'] = i[0], i[2]
        for i in constructors:
            for d in driverinfo.keys():
                if i[1] == driverinfo[d]['Team']:
                    if "TeamPosition" in driverinfo[d].keys():
                        continue
                    else: 
                        driverinfo[d]['TeamPosition'] = i[0]
                    if i[0]:
                        driverinfo[d]['TeamPoints'] = i[2]

        return driverinfo



