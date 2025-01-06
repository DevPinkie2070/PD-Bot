const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('funkrufnamen')
        .setDescription('Zeigt eine Übersicht der Funkrufnamen.'),
    async execute(interaction) {

        // ID des voreingestellten Channels
        const channelId = '1324874069602209794'; // Ersetze mit der ID deines Channels

        // Versuche, den Channel zu finden
        const channel = interaction.client.channels.cache.get(channelId);

        if (!channel) {
            // Fehlermeldung, falls der Channel nicht gefunden wurde
            return interaction.reply({ content: '❌ Der voreingestellte Channel wurde nicht gefunden.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x3498db) // Grünliches Farbschema
            .setTitle('📡 Übersicht der Funkrufnamen')
            .setDescription('Eine Liste der Funkrufnamen und deren Bedeutungen.')
            .addFields(
                { name: '**Leitungs- und Führungsebenen**', value: `
                **[V]ICTOR**: Leitungsebene  
                **[E]DWARD**: Führungsebene  
                **[T]OM**: Traffic Investigator / Supervisor
                ` },
                { name: '**Streifeneinheiten**', value: `
                **[L]INCOLN**: Streifeneinheit mit 1 Officer  
                **ADAM**: Streifeneinheit mit 2 Officers
                ` },
                { name: '**Spezial- und Unterstützungseinheiten**', value: `
                **DAVID**: SWAT Rufzeichen  
                **MARY**: Motorrad Unit  
                **KING**: Detective  
                **HENRY**: Gang Taskforce  
                **OCEAN**: Speed Enforcement Unit  
                **AIRSHIP**: Air Support Division
                ` }
            )

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