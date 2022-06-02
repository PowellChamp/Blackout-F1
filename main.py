import discord
import get_data

client = discord.Client()

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('$f1'):
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

        values = get_data.main()
        embedVar = discord.Embed(title="**Championship Standings**", colour=0xFFC300)
        embedVar.set_author(name='Blackout F1 | Season 8', icon_url='https://i.imgur.com/KlHtdK3.jpg', url='https://bit.ly/BlackoutS8')
        embedVar.add_field(name="Position", value="\n".join(driverStandings.Position), inline=True)
        embedVar.add_field(name="Driver", value="\n".join(driverStandings.Name), inline=True)
        embedVar.add_field(name="Points", value="\n".join(driverStandings.Points), inline=True)
        embedVar.set_footer(text="Created by Tom", icon_url="https://i.imgur.com/ncL0qpO.png")

        await message.channel.send(embed=embedVar)

def get_standings():
    standings = get_data.main()
    return standings


client.run('OTgxNjI2NDU2MzQzOTgyMDgx.GAaFit.L7_6LeZ1S9J9JDn9qqhzjt20DUDASfj400apj8')