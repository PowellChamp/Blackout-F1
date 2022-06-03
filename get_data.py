from __future__ import print_function

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from operator import getitem
from pprint import pprint


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
        # Writes Team, Wins, Podiums, Average
        for i in drivertoteam:
            if i == []:
                continue
            if i[0] != "TBA" and i[0] != '':
                name = i[0]
                if name.endswith("*"):
                    name = name.strip("*")
                wins = 0
                podiums = 0
                for r in i[4:]:
                    if r == "x": continue
                    if int(r) <= 3: podiums += 1
                    if int(r) == 1: wins += 1
                finishes = i[4:]
                finishes = [int(x) for x in finishes if x != 'x']
                average = round(sum(finishes) / len(finishes))

                driverinfo[name] = {"Team": i[1]}
                driverinfo[name]['Wins'] = wins
                driverinfo[name]['Podiums'] = podiums
                driverinfo[name]['Average'] = average

        # Writes Position
        for i in drivers:
            if i[1] != "TBA":
                name = i[1]
                if name.endswith("*"):
                    name = name.strip("*")
                driverinfo[name]['Position'], driverinfo[name]['Points'] = i[0], i[2]
        # Writes Team Position, Team Points

        for i in constructors:
            for d in driverinfo.keys():
                if i[1] == driverinfo[d]['Team']:
                    if "TeamPosition" in driverinfo[d].keys():
                        continue
                    else: 
                        driverinfo[d]['TeamPosition'] = i[0]
                    if i[0]:
                        driverinfo[d]['TeamPoints'] = i[2]

        driverinfo = dict(sorted(driverinfo.items(), key=lambda x: int(getitem(x[1], 'Position'))))
        return driverinfo

    def constructor_info(self):
        constructorinfo = {}
        drivertoteam = self.read("Drivers/Teams!A3:C")
        constructors = self.read("Constructor Standings!A2:C")

        # Writes Team, Wins, Podiums, Average
        constructorinfo = dict((i[1],{"Drivers": []}) for i in drivertoteam if i[0] != "TBA" and i[0] != '')


        for i in drivertoteam:
            name = i[0]
            if name.endswith("*"):
                name = name.strip("*")
            if i == []:
                continue
            if name != "TBA" and name != '':
                constructorinfo[i[1]]['Drivers'].append(name)
                if i[1] != "Reserve Drivers*":
                    constructorinfo[i[1]]['Livery'] = i[2]
                else:  constructorinfo[i[1]]['Livery'] = "N/A"

        # Writes Team Position, Team Points
        for i in constructors:
            for d in constructorinfo.keys():
                if i[1] == d:
                    if "TeamPosition" in constructorinfo[d].keys():
                        continue
                    else: 
                        constructorinfo[d]['TeamPosition'] = i[0]
                    if i[0]:
                        constructorinfo[d]['TeamPoints'] = i[2]

        constructorinfo = dict(sorted(constructorinfo.items(), key=lambda x: int(getitem(x[1], 'TeamPosition'))))
        return constructorinfo




