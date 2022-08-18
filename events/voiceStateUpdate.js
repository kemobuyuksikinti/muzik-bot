module.exports = async (client, oldState, newState) => {
  if (client.user.id === newState.id) {
    if (oldState.channelId && !newState.channelId) {
      const queue = client.player?.getQueue(newState.guild.id)
      if (queue) {
        if (queue.playing) {
          if (queue.metadata) {
            queue.metadata.send({ content: "Üzgünüm, ses kanalından ayrıldım. Umarım biri beni kanaldan atmamıştır. 😔" }).catch(e => { })
          }
          client.player?.deleteQueue(queue.metadata.guild.id)
        }
      }
    }
  }
}
