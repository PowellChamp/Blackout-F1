module.exports = {
    name : "createrace",

    execute(interaction, client) {

        const {
			MessageEmbed
		} = require('discord.js');

        const title = interaction.options.getString('title')
        const date = interaction.options.getString('date')
        const time = interaction.options.getString('time')

        console.log(title)
        console.log(date)
        console.log(time)

        const eventEmbed = new MessageEmbed()
			.setColor('#FFC300')
			.setTitle(title)
			.setAuthor('Blackout F1 | Season 8', 'https://i.imgur.com/KlHtdK3.jpg', 'https://bit.ly/BlackoutS8')
			.addField('Date', `${date} at ${time}`, false)
			.setTimestamp()
			.setFooter('Created by Tom', 'https://i.imgur.com/ncL0qpO.png');

        client.channels.cache.get("905860768359120916").send( `<t:${Date.now()}:d>` );

    }
}