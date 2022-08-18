module.exports = {
    name: "clear",
    description: "Müzik kuyruğunu temizler.",
    permissions: "0x0000000000000800",
    options: [],
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({ content: `Şu anda çalan müzik yok. ❌`, ephemeral: true }).catch(e => { })

        if (!queue.tracks[0]) return interaction.reply({ content: `Geçerli olandan sonra zaten sırada müzik yok ❌`, ephemeral: true }).catch(e => { })

        await queue.clear();

        interaction.reply({ content: `Kuyruk az önce temizlendi. 🗑️` }).catch(e => { })
    },
}
