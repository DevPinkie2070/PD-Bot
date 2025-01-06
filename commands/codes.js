const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('codes')
        .setDescription('Zeigt eine Übersicht der Dienst- und Funkcodes.'),
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
            .setColor(0x3498db)
            .setTitle('📋 Dienst- und Funkcodes')
            .setDescription('Eine Übersicht über die Notfallcodes, Statuscodes und Funkprotokolle.')
            .addFields(
                { name: '**Notfallcodes**', value: `
                **Code BREAK**: Notstand ausrufen  
                **Code GREEN**: Notstand aufheben  
                **Code BLACK**: Jegliche Staatsbeamten sammeln und schützen
                ` },
                { name: '**Einsatzcodes**', value: `
                **Code 1**: Ausbildung  
                **Code 2**: Einsatzfahrt mit Blaulicht  
                **Code 3**: Einsatzfahrt mit Blaulicht und Sirene  
                **Code 4**: Einsatz abgeschlossen  
                **Code 5**: Streifenpartner gesucht  
                **Code 6**: Einsatzfahrt  
                **Code 7**: Ladenraub  
                **Code 8**: Bankraub  
                **Code 9**: S.W.A.T benötigt  
                **Code 0**: Verstärkung benötigt
                ` },
                { name: '**10-Codes (Teil 1)**', value: `
                **10-01**: Dienstantritt  
                **10-02**: Dienstende  
                **10-03**: Negativ  
                **10-04**: Verstanden  
                **10-05**: Wiederholen/Nicht verstanden  
                **10-06**: Abwesend/nicht funkbereit/Pause  
                **10-07**: Funkstille auf unbegrenzte Zeit  
                **10-08**: Abholung benötigt
                ` },
                { name: '**10-Codes (Teil 2)**', value: `
                **10-09**: Fahrzeugbeschreibung  
                **10-10**: Täterbeschreibung  
                **10-11**: Frequenzänderung  
                **10-15**: Officer am Boden  
                **10-16**: Bodenunterstützung  
                **10-17**: Luftunterstützung  
                **10-18**: Anfahrt zum PD  
                **10-19**: Gefangenentransport
                ` },
                { name: '**10-Codes (Teil 3)**', value: `
                **10-20**: Aktueller Standort/ Status  
                **10-60**: Schussfreigabe  
                **10-61**: Schussfreigabe auf Reifen  
                **10-68**: Verkehrskontrolle  
                **10-80**: Verfolgungsjagd  
                **11-90**: Beamter in Bedrängnis  
                **11-99**: Beamter unter Beschuss
                ` },
                { name: '**Status-Codes**', value: `
                **Code 1**: Ohne Sonderrechte (kein Blaulicht/Sirene)  
                **Code 2**: Mit Sonderrechten (Blaulicht/Sirene)  
                **Code 3**: Am Einsatzort angekommen  
                **Code 4**: Einsatz beendet / Einsatzbereit  
                **Code 5**: Einsatz in Progress  
                **Code 6**: Auf Streife / Stand-By  
                **Code 7**: In der Dienststelle
                ` },
                { name: '**Blacklist**', value: `
                - Jegliche Grußformel (z.B.: Hallo)  
                - Beleidigungen  
                - Private Gespräche  
                - Im Funk bedankt man sich nicht  
                - Lange Romane  
                - Dumme Verbesserungen gegenüber anderen
                ` },
                { name: '**Hinweis**', value: 'Die Funkregeln aus der Dienstvorschrift sind zu beachten!' }
            )

            try {
                await channel.send({ embeds: [embed] });
                // Bestätigung an den Benutzer (optional)
                await interaction.reply({ content: '✅ Die Funkcodes wurden im voreingestellten Channel veröffentlicht.', ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '❌ Es gab einen Fehler beim Senden der Nachricht.', ephemeral: true });
            }
    },
};