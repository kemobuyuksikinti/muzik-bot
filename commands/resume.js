module.exports = {
    name: "resume",
    description: "Duraklatılan müziği yeniden başlatır.",
    permissions: "0x0000000000000800",
    options: [],
    run: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.reply({ content: `Şu anda çalan müzik yok!. ❌`, ephemeral: true }).catch(e => { })

        const success = queue.setPaused(false);

        return interaction.reply({ content: success ? `**${queue.current.title}**, Şarkı çalmaya devam ediyor. ✅` : `Bir şeyler yanlış gitti. ❌ Müziği daha önce durdurmamış gibisin.` }).catch(e => { })
    },
};
