const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const { clientId, guildId, token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Rollen-IDs festlegen (ersetze diese mit den tatsächlichen IDs auf deinem Server)
const ROLE_ADMIN = '1324874068813545507'; // Admin-Rolle für vollen Zugriff
const ROLE_TEAMLEAD = '1324874068700299317'; // Detektive für Detektiv-Tickets
const ROLE_SUPPORT = '1324874068658491508'; // SWAT für SWAT-Tickets
const ROLE_MOD = '1324874068658491506'; // Personalabteilung für Bewerbung
const ROLE_FACTION = '1324874068658491506'; // Personalabteilung für Beschwerden

// Kategorien-IDs festlegen (ersetze diese mit den tatsächlichen IDs auf deinem Server)
const CATEGORY_SUPPORT = '1324875772384772228'; // Antrag
const CATEGORY_FRAGE = '1324875772384772228';   // SWAT Tickets
const CATEGORY_ENTBANNUNG = '1324875772384772228'; // Detective Tickets
const CATEGORY_FRAKTIONSVERWALTUNG = '1324875772384772228'; // Für Beschwerden
const CATEGORY_TEAMBEWERBUNG = '1324875772384772228'; // Für Bewerbungen

// Commands dynamisch laden
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    
    // Debugging: Zeige die exportierten Daten der Command-Datei an
    console.log(command);

    // Überprüfen, ob die Command-Datei ein gültiges 'data'-Objekt hat
    if (!command.data || !command.data.name) {
        console.error(`Fehler: Die Command-Datei ${file} hat kein gültiges 'data'-Objekt.`);
    } else {
        client.commands.set(command.data.name, command);
        commands.push(command.data);
    }
}

// Commands bei Discord registrieren
client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('Registriere Slash-Commands...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );

        client.user.setPresence({
            activities: [{ name: 'Im Dienst', type: 4 }],
            status: 'online'
        });

        console.log(`Bot ist bereit! Eingeloggt als ${client.user.tag}`);
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Es gab einen Fehler beim Ausführen des Commands!', ephemeral: true });
        }
    } 
    // Ticket-Erstellungsbutton 
    else if (interaction.isButton() && ['support', 'frage', 'entbannung', 'fraktionsverwaltung', 'teambewerbung'].includes(interaction.customId)) {
        const { user, guild } = interaction;

        let categoryID;
        const permissions = [
            {
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: ROLE_ADMIN,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            }
        ];

        if (interaction.customId === 'support') {
            categoryID = CATEGORY_SUPPORT;
            permissions.push({ id: ROLE_SUPPORT, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
        } else if (interaction.customId === 'frage') {
            categoryID = CATEGORY_FRAGE;
        } else if (interaction.customId === 'entbannung') {
            categoryID = CATEGORY_ENTBANNUNG;
            permissions.push({ id: ROLE_MOD, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
        } else if (interaction.customId === 'fraktionsverwaltung') {
            categoryID = CATEGORY_FRAKTIONSVERWALTUNG;
            permissions.push({ id: ROLE_FACTION, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
        } else if (interaction.customId === 'teambewerbung') {
            categoryID = CATEGORY_TEAMBEWERBUNG;
            permissions.push({ id: ROLE_TEAMLEAD, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
        }

        // Erstellen des Ticket-Kanals
        const channelName = `ticket-${user.username}`;
        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: 0,
            parent: categoryID,
            permissionOverwrites: permissions,
        });

        // Initiale Nachricht mit Schließen-Button
        const closeEmbed = new EmbedBuilder()
            .setTitle('Ticket Unterstützung')
            .setDescription('Ein Teammitglied wird bald hier sein, um dir zu helfen. Drücke den Button unten, um das Ticket zu schließen, wenn du fertig bist.')
            .setColor('#ff0000');

        const closeButtonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Ticket schließen')
                    .setStyle(ButtonStyle.Danger)
            );

        await ticketChannel.send({ embeds: [closeEmbed], components: [closeButtonRow] });
        await interaction.reply({ content: `Ticket erstellt: ${ticketChannel}`, ephemeral: true });
    }
    
    // Ticket schließen, wenn der close_ticket Button gedrückt wird
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
        const ticketChannel = interaction.channel;

        await interaction.deferUpdate(); // Antwort an Discord, um keine Fehler auszulösen
        await interaction.followUp({ content: 'Das Ticket wird in 3 Sekunden geschlossen...', ephemeral: true });

        setTimeout(() => ticketChannel.delete().catch(console.error), 3000);
    }
});

// Bot anmelden
client.login(token);
