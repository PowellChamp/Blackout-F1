import discord
from discord.ext import commands
from get_data import get_data

bot = commands.Bot(command_prefix='$f1 ')
data = get_data("1fJmdaoYiMquDwgxFETxv2Ig4A_Qon9lZSsDwnR8malw")

class botData:
    botCommands = {
        "help" : "Displays Help information about the Blackout F1 Bot",
        "standings" : "Displays the current season standings by driver",
        "constructors" : "Displays the current season standings by constructor",
        "stats" : "Displays your stats as well as other driver's"
    }
    season = "Season 10"

@bot.event
async def on_ready():
    print('We have logged in as {0.user}'.format(bot))

@bot.command(aliases=['s', 'drivers', 'd'])
async def standings(ctx, clear=1, *args):
    class driverStandings:
        Position = []
        Name = []
        Points = []

    standings = get_standings()
    for value in standings:
        if value[1] == "TBA":
            continue
        driverStandings.Position.append(value[0])
        driverStandings.Name.append(value[1])
        driverStandings.Points.append(value[2])

    embedVar = discord.Embed(title="**Championship Standings**", colour=0xFFC300)
    embedVar.set_author(name=f"Blackout F1 | {botData.season}", icon_url='https://i.imgur.com/KlHtdK3.jpg', url='https://bit.ly/BlackoutS8')
    embedVar.add_field(name="Position", value="\n".join(driverStandings.Position), inline=True)
    embedVar.add_field(name="Driver", value="\n".join(driverStandings.Name), inline=True)
    embedVar.add_field(name="Points", value="\n".join(driverStandings.Points), inline=True)
    embedVar.set_footer(text="Created by Tom", icon_url="https://i.imgur.com/ncL0qpO.png")
    await ctx.message.reply(embed=embedVar)

@bot.command(aliases=['c'])
async def constructors(ctx, *args):
    class constructorStandings:
        Position = []
        Name = []
        Points = []
    
    constructors = get_constructors()
    for value in constructors:
        if value[1] == "Reserve Drivers*":
            continue
        constructorStandings.Position.append(value[0])
        constructorStandings.Name.append(value[1])
        constructorStandings.Points.append(value[2])

    embedVar = discord.Embed(title="**Constructor Standings**", colour=0xFFC300)
    embedVar.set_author(name=f"Blackout F1 | {botData.season}", icon_url='https://i.imgur.com/KlHtdK3.jpg', url='https://bit.ly/BlackoutS8')
    embedVar.add_field(name="Position", value="\n".join(constructorStandings.Position), inline=True)
    embedVar.add_field(name="Driver", value="\n".join(constructorStandings.Name), inline=True)
    embedVar.add_field(name="Points", value="\n".join(constructorStandings.Points), inline=True)
    embedVar.set_footer(text="Created by Tom", icon_url="https://i.imgur.com/ncL0qpO.png")
    await ctx.message.reply(embed=embedVar)

@bot.command()
async def stats(ctx, *args):
    driverinfo = driver_info()
    if args == ():
        user = str(ctx.author).split("#")[0]
    else:
        user = args[0]
    try:
        user_info = driverinfo[user]
    except:
        await ctx.message.reply(f"User: {user} not found in database (This is case sensitive, run $f1 s to list all drivers)")
        return

    embedVar = discord.Embed(title=f"**{user}'s Stats**", colour=0xFFC300)
    embedVar.set_author(name=f"Blackout F1 | {botData.season}", icon_url='https://i.imgur.com/KlHtdK3.jpg', url='https://bit.ly/BlackoutS8')
    embedVar.add_field(name="Position", value=user_info['Position'], inline=True)
    embedVar.add_field(name="Points", value=user_info['Points'], inline=True)
    embedVar.add_field(name="Team", value=user_info['Team'], inline=True)
    embedVar.add_field(name="Podiums", value=user_info['Podiums'], inline=True)
    embedVar.add_field(name="Wins", value=user_info['Wins'], inline=True)
    embedVar.add_field(name="Team's Position", value=user_info['TeamPosition'], inline=True)
    embedVar.add_field(name="Team's Points", value=user_info['TeamPoints'], inline=True)
    embedVar.set_footer(text="Created by Tom", icon_url="https://i.imgur.com/ncL0qpO.png")
    await ctx.message.reply(embed=embedVar)


def get_standings():
    standings = data.read("Drivers Standings!A2:C")
    return standings

def get_constructors():
    constructors = data.read("Constructor Standings!A2:C")
    return constructors

def driver_info():
    driver_info = data.driver_info()
    return driver_info

bot.run('OTAzMzM1MzIyMzg4MTM1OTU2.GZVIx3.fTEYugaZX3ElvBhV3RneH3HeOG2AAyjrnS8V2w')