const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		// Überprüfen, ob der Befehl in einem Server verwendet wird
		if (!interaction.guild) {
			return await interaction.reply('Dieser Befehl kann nur in einem Server verwendet werden.');
		}

		// Erstelle das Embed
		const serverembed = new EmbedBuilder()
			.setColor('#333')
			.setTitle(`Server: ${interaction.guild.name}`)
			.setDescription(`Der Server hat ${interaction.guild.memberCount} Mitglieder.`)
			.setFooter({ text: 'Bot by Pinkie2070' });

		// Antworte mit dem Embed anstelle einer Textnachricht
		await interaction.reply({ embeds: [serverembed] });
	},
};
