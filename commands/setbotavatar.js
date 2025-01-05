const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setbotavatar')
		.setDescription('Ändert das Bot-Avatar auf das aktuelle Server-Profilbild.'),
	async execute(interaction) {
		// Prüfen, ob der Server ein Icon hat
		const serverIconURL = interaction.guild.iconURL();
		
		if (!serverIconURL) {
			return await interaction.reply({
				content: 'Dieser Server hat kein Profilbild!',
				ephemeral: true
			});
		}
		
		// Avatar des Bots auf das Server-Icon setzen
		try {
			await interaction.client.user.setAvatar(serverIconURL);
			await interaction.reply('Avatar des Bots wurde erfolgreich auf das Server-Profilbild gesetzt!');
			console.log('Bot-Avatar erfolgreich geändert.');
		} catch (error) {
			console.error('Fehler beim Ändern des Bot-Avatars:', error);
			await interaction.reply('Es gab ein Problem beim Ändern des Bot-Avatars.');
		}
	},
};
