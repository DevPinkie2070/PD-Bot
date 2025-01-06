const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const { clientId, guildId, token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Rollen-IDs festlegen
const ROLE_ADMIN = '1324874068813545507';
const ROLE_TEAMLEAD = '1324874068700299317';
const ROLE_SUPPORT = '1324874068658491508';
const ROLE_MOD = '1324874068658491506';
const ROLE_FACTION = '1324874068658491506';

// Kategorien-IDs festlegen
const CATEGORY_SUPPORT = '1324875772384772228';
const CATEGORY_FRAGE = '1324875772384772228';
const CATEGORY_ENTBANNUNG = '1324875772384772228';
const CATEGORY_FRAKTIONSVERWALTUNG = '1324875772384772228';
const CATEGORY_TEAMBEWERBUNG = '1324875772384772228';

// Commands dynamisch laden
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.data.name) {
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
    
    // Ticket-Erstellungsmenü
    else if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
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

        const selectedOption = interaction.values[0];

        switch (selectedOption) {
            case 'support':
                categoryID = CATEGORY_SUPPORT;
                permissions.push({ id: ROLE_SUPPORT, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
                break;
            case 'frage':
                categoryID = CATEGORY_FRAGE;
                break;
            case 'entbannung':
                categoryID = CATEGORY_ENTBANNUNG;
                permissions.push({ id: ROLE_MOD, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
                break;
            case 'fraktionsverwaltung':
                categoryID = CATEGORY_FRAKTIONSVERWALTUNG;
                permissions.push({ id: ROLE_FACTION, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
                break;
            case 'teambewerbung':
                categoryID = CATEGORY_TEAMBEWERBUNG;
                permissions.push({ id: ROLE_TEAMLEAD, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] });
                break;
            default:
                return interaction.reply({ content: 'Ungültige Option.', ephemeral: true });
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
    
    // Ticket schließen
    if (interaction.isButton() && interaction.customId === 'close_ticket') {
        const ticketChannel = interaction.channel;

        await interaction.deferUpdate();
        await interaction.followUp({ content: 'Das Ticket wird in 3 Sekunden geschlossen...', ephemeral: true });

        setTimeout(() => ticketChannel.delete().catch(console.error), 3000);
    }
});

// Bot anmelden
client.login(token);