const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rights')
        .setDescription('Zeigt die Miranda-Warnung.'),
    async execute(interaction) {

        // ID des voreingestellten Channels
        const channelId = '1324874069602209795'; // Ersetze mit der ID deines Channels

        // Versuche, den Channel zu finden
        const channel = interaction.client.channels.cache.get(channelId);

        if (!channel) {
            // Fehlermeldung, falls der Channel nicht gefunden wurde
            return interaction.reply({ content: '❌ Der voreingestellte Channel wurde nicht gefunden.', ephemeral: true });
        }


        const embed = new EmbedBuilder()
            .setColor(0x3498db) // Rot als Signalfarbe
            .setTitle('⚖️ Miranda-Warnung')
            .setDescription('Die Rechte, die einer Person bei der Festnahme vorgelesen werden:')
            .addFields(
                { name: 'Warnung', value: `
                **„Sie haben das Recht zu schweigen. Alles, was Sie sagen, kann und wird vor Gericht gegen Sie verwendet werden.  
                Sie haben das Recht, zu jeder Vernehmung einen Verteidiger hinzuzuziehen.  
                Wenn Sie sich keinen Verteidiger leisten können, wird Ihnen einer gestellt. Verstehen Sie diese Rechte?“**` },
                { name: 'Zusätzliche Fragen', value: `
                **„Haben Sie die Rechte verstanden, die ich Ihnen soeben vorgelesen habe?“**  
                **„Wollen Sie angesichts dieser Rechte mit mir sprechen?“**` }
            )
            .setFooter({ text: 'Rechte gemäß Miranda v. Arizona (1966)'}); // Optional: Icon für den Footer

            try {
                await channel.send({ embeds: [embed] });
                // Bestätigung an den Benutzer (optional)
                await interaction.reply({ content: '✅ Die Funkrufnamen wurden im voreingestellten Channel veröffentlicht.', ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '❌ Es gab einen Fehler beim Senden der Nachricht.', ephemeral: true });
            }
    },
};