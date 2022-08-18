module.exports = {
    TOKEN: "",
    ownerID: "", // Botun sahibinin ID'sını girin.
    botInvite: "", // Botun davet linkini yaz.
    status: 'KEMOSALVO',
    commandsDir: './commands', // Elleme bozulur

    opt: {
        DJ: {
            commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume'] // Elleme bozulur
        },

        voiceConfig: {
            leaveOnEnd: false, // Burası "true" ise şarkı bittikten sonra bot sesten çıkar.
            autoSelfDeaf: false, // Burayı ellemeyin boşverin.

            leaveOnTimer: { // Bu seçeneği kullanmak istiyorsanız yukardaki "leaveOnEnd" seçeneği "false" olmak zorundadır.
                status: true, // Burası "true" ise bot çevrimdışı olduğunda kanaldan ayrılacaktır.
                time: 20000, //1000 = 1 saniye
            }
        },

        maxVol: 100, // Sesin max kaça çıkacağını ayarlıyabilirsiniz.
        loopMessage: false,

        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio', // Elleme bozulur
                highWaterMark: 1 << 25 // Elleme bozulur
            }
        }
    }
}
