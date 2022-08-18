const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("croxydb");
module.exports = {
  name: "queue",
  description: "Size çalma listesini gösterir.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {

    let cmds = db.get("queue." + interaction.user.id + interaction.guild.id + interaction.channel.id)
    const queue = client.player.getQueue(interaction.guild.id);
    if (!queue || !queue.playing) return interaction.reply({ content: `Şu anda çalan müzik yok!. ❌`, ephemeral: true }).catch(e => { })
    if (!queue.tracks[0]) return interaction.reply({ content: `Akımdan sonra sırada müzik yok. ❌`, ephemeral: true }).catch(e => { })
    if (cmds) return interaction.reply({ content: `Burada zaten aktif bir komutunuz var. ❌\nhttps://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${cmds}`, ephemeral: true }).catch(e => { })


    const trackl = []
    queue.tracks.map(async (track, i) => {
      trackl.push({
        title: track.title,
        author: track.author,
        requestedBy: {
          id: track.requestedBy.id
        },
        url: track.url,
        duration: track.duration
      })
    })

    const backId = "emojiBack"
    const forwardId = "emojiForward"
    const backButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      emoji: "⬅️",
      customId: backId
    });

    const deleteButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      emoji: "❌",
      customId: "close"
    });

    const forwardButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      emoji: "➡️",
      customId: forwardId
    });


    let kaçtane = 8
    let page = 1
    let a = trackl.length / kaçtane
    let b = `${a + 1}`
    let toplam = b.charAt(0)

    const generateEmbed = async (start) => {
      let sayı = page === 1 ? 1 : page * kaçtane - kaçtane + 1
      const current = trackl.slice(start, start + kaçtane)
      return new EmbedBuilder()
        .setTitle(`Sunucu Müzik Listesi- ${interaction.guild.name}`)
        .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
        .setColor('007fff')
        .setDescription(`Çalmakta: \`${queue.current.title}\`
${await Promise.all(current.map(data =>
          `\n\`${sayı++}\` | [${data.title}](${data.url}) | **${data.author}** (Başlatan <@${data.requestedBy.id}>)`
        ))}`)
        .setFooter({ text: `Sayfa ${page} / ${toplam}` })
    }

    const canFitOnOnePage = trackl.length <= kaçtane

    await interaction.reply({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage
        ? []
        : [new ActionRowBuilder({ components: [deleteButton, forwardButton] })],
      fetchReply: true
    }).then(async Message => {
      await db.set("queue." + interaction.user.id + interaction.guild.id + interaction.channel.id, Message.id)


      const filter = i => i.user.id === interaction.user.id
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });


      let currentIndex = 0
      collector.on("collect", async (button) => {
        if (button.customId === "close") {
          collector.stop()
          await db.delete("queue." + interaction.user.id + interaction.guild.id + interaction.channel.id)
          return button.reply({ content: `Komut iptal edildi. ✅`, ephemeral: true }).catch(e => { })
        } else {

          if (button.customId === backId) {
            page--
          }
          if (button.customId === forwardId) {
            page++
          }

          button.customId === backId
            ? (currentIndex -= kaçtane)
            : (currentIndex += kaçtane)

          await interaction.editReply({
            embeds: [await generateEmbed(currentIndex)],
            components: [
              new ActionRowBuilder({
                components: [
                  ...(currentIndex ? [backButton] : []),
                  deleteButton,
                  ...(currentIndex + kaçtane < trackl.length ? [forwardButton] : []),
                ],
              }),
            ],
          }).catch(e => { })
          await button.deferUpdate();
        }
      })

      collector.on("end", async (button) => {

        await db.delete("queue." + interaction.user.id + interaction.guild.id + interaction.channel.id)

        button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("⬅️")
            .setCustomId(backId)
            .setDisabled(true),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("❌")
            .setCustomId("close")
            .setDisabled(true),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("➡️")
            .setCustomId(forwardId)
            .setDisabled(true))

        const embed = new EmbedBuilder()
          .setTitle(`Sunucu Müzik Listesi - Süre Sona Erdi!`)
          .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
          .setColor('007fff')
          .setDescription(`Bu komutu kullanmak için süreniz doldu, komutu tekrar kullanmak için  \`/queue\` yazabilirsiniz.`)
          .setFooter({ text: `Kemosalvo` })
        return interaction.editReply({ embeds: [embed], components: [button] }).catch(e => { })

      })
    }).catch(e => { })

  }
}
