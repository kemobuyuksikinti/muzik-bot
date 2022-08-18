const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: "save",
    description: "Çalınan müziği dm kutusu aracılığıyla size gönderir ve kaydeder.",
    permissions: "0x0000000000000800",
    options: [],
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({ content: `Şu anda çalan müzik yok!. ❌`, ephemeral: true }).catch(e => { })

        const embed = new EmbedBuilder()
            .setColor('007fff')
            .setTitle(client.user.username + " - Track'ı kaydet")
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                { name: `Track`, value: `\`${queue.current.title}\`` },
                { name: `Duration`, value: `\`${queue.current.duration}\`` },
                { name: `URL`, value: `${queue.current.url}` },
                { name: `Saved Server`, value: `\`${interaction.guild.name}\`` },
                { name: `Requested By`, value: `${queue.current.requestedBy}` }
            ])
            .setTimestamp()
            .setFooter({ text: `Kemosalvo` })
        interaction.user.send({ embeds: [embed] }).then(() => {
            interaction.reply({ content: `Müziğin adını özel mesajla gönderdim. ✅`, ephemeral: true }).catch(e => { })
        }).catch(error => {
            interaction.reply({ content: `Size özel mesaj gönderilemiyor. ❌`, ephemeral: true }).catch(e => { })
        });
    },
};
