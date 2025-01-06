const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketsetup')
        .setDescription('Richtet das Ticketsystem ein.'),

    async execute(interaction) {
        const ticketChannel = interaction.channel;

        const embed = new EmbedBuilder()
            .setTitle('🎫 Erstelle ein Ticket')
            .setDescription('Wähle eine Option aus dem Menü unten, um ein Ticket zu erstellen:')
            .setImage(process.env.LSPD_BANNER || 'https://static.wikia.nocookie.net/ultimate-roleplay/images/2/20/New_LSPD_Banner.jpg/revision/latest?cb=20170407023834')
            .setColor('#333333');

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_select')
                    .setPlaceholder('Wähle eine Ticket-Option aus...')
                    .addOptions([
                        {
                            label: 'Antrag',
                            description: 'Erstelle ein Ticket für einen Antrag.',
                            emoji: '📝',
                            value: 'support',
                        },
                        {
                            label: 'Beschwerde',
                            description: 'Reiche eine Beschwerde ein.',
                            emoji: '📪',
                            value: 'fraktionsverwaltung',
                        },
                        {
                            label: 'Bewerbung',
                            description: 'Bewirb dich für eine Position.',
                            emoji: '✉️',
                            value: 'teambewerbung',
                        },
                    ])
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