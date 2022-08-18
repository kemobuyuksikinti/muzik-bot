module.exports = {
    name: "skip",
    description: "Çalınan müziği değiştirir.",
    permissions: "0x0000000000000800",
    options: [],
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({ content: `Şu anda çalan müzik yok!. ❌`, ephemeral: true }).catch(e => { })

        const success = queue.skip();

        return interaction.reply({ content: success ? `**${queue.current.title}**, Atlanan şarkı ✅` : `Bir şeyler yanlış gitti ❌` }).catch(e => { })
    },
};
