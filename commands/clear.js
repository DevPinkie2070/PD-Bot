const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Löscht eine bestimmte Anzahl an Nachrichten im aktuellen Kanal.')
        .addIntegerOption(option =>
            option.setName('anzahl')
                .setDescription('Die Anzahl der Nachrichten, die gelöscht werden sollen (1-100).')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Erfordert die Berechtigung "Nachrichten verwalten"
    async execute(interaction) {
        const amount = interaction.options.getInteger('anzahl');

        // Überprüfen, ob die Anzahl gültig ist
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Bitte gib eine Anzahl zwischen 1 und 100 ein.', ephemeral: true });
        }

        const channel = interaction.channel;

        // Nachrichten löschen
        try {
            const deletedMessages = await channel.bulkDelete(amount, true);
            await interaction.reply({ content: `Erfolgreich ${deletedMessages.size} Nachrichten gelöscht.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Es gab ein Problem beim Löschen der Nachrichten. Stelle sicher, dass die Nachrichten nicht älter als 14 Tage sind.', ephemeral: true });
        }
    },
};