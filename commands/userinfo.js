// commands/userinfo.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Sendet Informationen über einen Benutzer in einer eingebetteten Nachricht.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Der Benutzer, über den Informationen angezeigt werden sollen')
        .setRequired(true)
    ),
  async execute(interaction) {
    // ID der Rolle, die Zugriff auf diesen Command hat
    const allowedRoleId = '1177621504322707527';

    // Überprüfe, ob der Benutzer die erforderliche Rolle hat
    if (!interaction.member.roles.cache.has(allowedRoleId)) {
      return await interaction.reply({
        content: 'Du hast keine Berechtigung, diesen Befehl zu verwenden.',
        ephemeral: true
      });
    }

    // Hole den Benutzer, für den die Informationen angezeigt werden sollen
    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    // Erstelle das Embed
    const userEmbed = new EmbedBuilder()
      .setColor('#480a69') // Setzt die Farbe des Embeds
      .setTitle('Benutzerinformationen') // Titel des Embeds
      .setDescription(`Informationen über ${user.username}`) // Beschreibung des Embeds
      .setThumbnail(user.displayAvatarURL()) // Setzt das Thumbnail als Benutzer-Avatar
      .addFields(
        { name: 'Benutzername', value: user.username, inline: true }, // Füge ein Feld hinzu
        { name: 'Benutzer-ID', value: user.id, inline: true }, // Ein weiteres Feld
        { name: 'Erstellt am', value: `${user.createdAt}`, inline: false }, // Erstellungsdatum
        { name: 'Beigetreten am', value: `${member.joinedAt}`, inline: false } // Beitrittsdatum
      )
      .setTimestamp() // Fügt einen Zeitstempel hinzu
      .setFooter({ text: 'Benutzerinfo', iconURL: interaction.client.user.displayAvatarURL() }); // Fußzeile des Embeds

    // Sende das Embed als Antwort
    await interaction.reply({ embeds: [userEmbed] });
  },
};
