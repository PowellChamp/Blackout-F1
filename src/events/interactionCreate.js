module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;
        
        try {
            interaction.reply("CALCULATING...").then(() => command.execute(interaction, client));
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'There was an error while executing this command!',
                 ephemeral: true 
            });
        };
    },
}

        // // try {
        //     interaction.reply("CALCULATING...").then(() => command.execute(interaction, client));
        // // } catch (error) {
        //     // console.error(error);
        //     // await interaction.reply({ 
        //     //     content: 'There was an error while executing this command!',
        //     //      ephemeral: true 
        //     // });
        // // };