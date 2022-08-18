const { ApplicationCommandOptionType } = require('discord.js');
const maxVol = require("../config.js").opt.maxVol;
module.exports = {
    name: "volume",
    description: "Müziğin sesini ayarlamanızı sağlar. 🔊",
    permissions: "0x0000000000000800",
    options: [{
        name: 'volume',
        description: 'Sesi ayarlamak için numarayı yazın.',
        type: ApplicationCommandOptionType.Integer,
        required: true
    }],
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply({ content: `Şu anda çalan müzik yok!. ❌`, ephemeral: true }).catch(e => { })

        const vol = parseInt(interaction.options.getInteger('volume'));

        if (!vol) return interaction.reply({ content: `Mevcut ses ayarı: **${queue.volume}** 🔊\n**Sesi ayarlamak için, \`1\` ve \`${maxVol}\` arasında bir sayı yazınız.**`, ephemeral: true }).catch(e => { })

        if (queue.volume === vol) return interaction.reply({ content: `Değiştirmek istediğiniz ses düzeyi zaten mevcut ses düzeyidir ❌`, ephemeral: true }).catch(e => { })

        if (vol < 0 || vol > maxVol) return interaction.reply({ content: `**Ses seviyesini değiştirmek için: \`1\` ve \`${maxVol}\` arasında bir sayı yazınız .** ❌`, ephemeral: true }).catch(e => { })

        const success = queue.setVolume(vol);

        return interaction.reply({ content: success ? `Ses seviyesi değişti: **${vol}**/**${maxVol}** 🔊` : `Bir şeyler yanlış gitti. ❌` }).catch(e => { })
    },
};
