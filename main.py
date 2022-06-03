import discord
from discord.ext import commands
from get_data import get_data

import os

bot = commands.Bot(command_prefix='$f1 ')
data = get_data("1fJmdaoYiMquDwgxFETxv2Ig4A_Qon9lZSsDwnR8malw")

class botData:
    botCommands = {
        "help" : "Displays Help information about the Blackout F1 Bot",
        "standings" : "Displays the current season standings by driver",
        "constructors" : "Displays the current season standings by constructor",
    }
    season = "Season 8"

@bot.event
async def on_ready():
    print('We have logged in as {0.user}'.format(bot))

@bot.command(aliases=['s', 'drivers', 'd'])
async def standings(ctx, *, arg=None):
    driverinfo = driver_info()

    def main():
        class driverStandings:
            Position = []
            Name = []
            Points = []

        for name in driverinfo.keys():
            if name == "TBA":
                continue
            driverStandings.Position.append(driverinfo[name]['Position'])
            driverStandings.Name.append(name)
            driverStandings.Points.append(driverinfo[name]['Points'])

        embedVar = discord.Embed(title="**Championship Standings**", colour=0xFFC300)
        embedVar.set_author(name=f"Blackout F1 | {botData.season}", icon_url='https://i.imgur.com/KlHtdK3.jpg', url='https://bit.ly/BlackoutS8')
        embedVar.add_field(name="Position", value="\n".join(driverStandings.Position), inline=True)
        embedVar.add_field(name="Driver", value="\n".join(driverStandings.Name), inline=True)
        embedVar.add_field(name="Points", value="\n".join(driverStandings.Points), inline=True)
        embedVar.set_footer(text="Created by Tom", icon_url="https://i.imgur.com/ncL0qpO.png")
        return embedVar

    def driverstats(arg):
        class driverStats:
            Position = ""
            Name = ""
            Points = ""
            Team = ""
            TeamPoints = ""
            TeamPosition = ""
            Wins = 0
            Podiums = 0
            Average = 0
        
        if arg.lower() == "me":
            user = str(ctx.author).split("#")[0]
        else:
            user = arg
        
        for name in driverinfo.keys():
            if name.lower() == user.lower():
                driverStats.Position = driverinfo[name]['Position']
                driverStats.Name = name
                driverStats.Points = driverinfo[name]['Points']
                driverStats.Team = driverinfo[name]['Team']
                driverStats.TeamPoints = driverinfo[name]['TeamPoints']
                driverStats.TeamPosition = driverinfo[name]['TeamPosition']
                driverStats.Wins = driverinfo[name]['Wins']
                driverStats.Podiums = driverinfo[name]['Podiums']
                driverStats.Average = driverinfo[name]['Average']
        
        embedVar = discord.Embed(title=f"**{driverStats.Name}'s Stats**", colour=0xFFC300)
        embedVar.set_author(name=f"Blackout F1 | {botData.season}", icon_url='https://i.imgur.com/KlHtdK3.jpg', url='https://bit.ly/BlackoutS8')
        embedVar.add_field(name="Position", value=driverStats.Position, inline=True)
        embedVar.add_field(name="Points", value=driverStats.Points, inline=True)
        embedVar.add_field(name="Team", value=driverStats.Team, inline=True)
        embedVar.add_field(name="Wins", value=driverStats.Wins, inline=True)
        embedVar.add_field(name="Podiums", value=driverStats.Podiums, inline=True)
        embedVar.add_field(name="Average Finish", value=driverStats.Average, inline=True)
        embedVar.add_field(name="Team's Position", value=driverStats.TeamPosition, inline=True)
        embedVar.add_field(name="Team's Points", value=driverStats.TeamPoints, inline=True)
        embedVar.set_footer(text="Created by Tom", icon_url="https://i.imgur.com/ncL0qpO.png")
        return embedVar
        
    try: 
        if arg.lower() in [i.lower() for i in driverinfo.keys()] or arg.lower() == "me":
            embedVar = driverstats(arg)
        else:
            embedVar = main()
    except:
        embedVar = main()

    await ctx.message.reply(embed=embedVar)

@bot.command(aliases=['c'])
async def constructors(ctx, *, arg=None):
    constructors = constructor_info()

    def main():
        class constructorStandings:
            Position = []
            Name = []
            Points = []
        
        for name in constructors.keys():
            constructorStandings.Position.append(constructors[name]['TeamPosition'])
            constructorStandings.Name.append(name)
            constructorStandings.Points.append(constructors[name]['TeamPoints'])

        embedVar = discord.Embed(title="**Constructor Standings**", colour=0xFFC300)
        embedVar.set_author(name=f"Blackout F1 | {botData.season}", icon_url='https://i.imgur.com/KlHtdK3.jpg', url='https://bit.ly/BlackoutS8')
        embedVar.add_field(name="Position", value="\n".join(constructorStandings.Position), inline=True)
        embedVar.add_field(name="Team", value="\n".join(constructorStandings.Name), inline=True)
        embedVar.add_field(name="Points", value="\n".join(constructorStandings.Points), inline=True)
        embedVar.set_footer(text="Created by Tom", icon_url="https://i.imgur.com/ncL0qpO.png")
        return embedVar
    
    def teamstats(arg):
        class teamStats:
            Position = ""
            Name = ""
            Points = ""
            Drivers = []
            Livery = ""

        for name in constructors.keys():
            if name.lower() == arg.lower():
                teamStats.Name = name
                teamStats.Position = constructors[name]['TeamPosition']
                teamStats.Points = constructors[name]['TeamPoints']
                teamStats.Drivers = constructors[name]['Drivers']
                teamStats.Livery = constructors[name]['Livery']
            
        embedVar = discord.Embed(title=f"**{teamStats.Name} Stats**", colour=0xFFC300)
        embedVar.set_author(name=f"Blackout F1 | {botData.season}", icon_url='https://i.imgur.com/KlHtdK3.jpg', url='https://bit.ly/BlackoutS8')
        embedVar.add_field(name="Position", value=teamStats.Position, inline=True)
        embedVar.add_field(name="Points", value=teamStats.Points, inline=True)
        embedVar.add_field(name="Drivers", value=", ".join(teamStats.Drivers), inline=False)
        embedVar.add_field(name="Livery", value=teamStats.Livery, inline=False)
        embedVar.set_footer(text="Created by Tom", icon_url="https://i.imgur.com/ncL0qpO.png")
        return embedVar
    try: 
        if arg.lower() in [i.lower() for i in constructors.keys()]:
            embedVar = teamstats(arg)
        else:
            embedVar = main()
    except:
        embedVar = main()


    await ctx.message.reply(embed=embedVar)

def constructor_info():
    constructor_info = data.constructor_info()
    return constructor_info

def driver_info():
    driver_info = data.driver_info()
    return driver_info

bot.run(os.getenv('TOKEN'))