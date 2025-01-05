const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketsetup')
        .setDescription('Richtet das Ticketsystem ein.'),

    async execute(interaction) {
        const ticketChannel = interaction.channel;

        const embed = new EmbedBuilder()
            .setTitle('🎫 Erstelle ein Ticket')
            .setDescription('Wähle eine Option, um ein Ticket zu erstellen:')
            //.setThumbnail('https://media.tenor.com/Z3UnzqoaujMAAAAe/lspd.png')
            .setImage(process.env.LSPD_BANNER || 'https://example.com/default-banner.png')
            .setColor('#333333')

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('support')
                    .setLabel('Antrag')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📝'),
                new ButtonBuilder()
                    .setCustomId('frage')
                    .setLabel('SWAT')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('💣'),
                new ButtonBuilder()
                    .setCustomId('entbannung')
                    .setLabel('Detective')
                    .setEmoji('🕵️‍♂️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('fraktionsverwaltung')
                    .setLabel('Beschwerde')
                    .setEmoji('📪')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('teambewerbung')
                    .setLabel('Bewerbung')
                    .setEmoji('✉️')
                    .setStyle(ButtonStyle.Secondary)
            );

        try {
            await ticketChannel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: 'Das Ticketsystem wurde erfolgreich eingerichtet!', ephemeral: true });
        } catch (error) {
            console.error('Error setting up ticket system:', error);
            await interaction.reply({ content: 'Es gab einen Fehler beim Einrichten des Ticketsystems.', ephemeral: true });
        }
    }
};
