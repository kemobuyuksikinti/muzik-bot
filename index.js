const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const config = require("./config")
const TOKEN = config.TOKEN || process.env.TOKEN;
const fs = require('fs');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Sunucu ile ilgili şeyler için
    GatewayIntentBits.GuildMembers, // Sunucu üyeleri ile ilgili şeyler için
    GatewayIntentBits.GuildIntegrations, // Discord entegrasyonları için
    GatewayIntentBits.GuildVoiceStates, // Ses ile ilgili şeyler için
    GatewayIntentBits.GuildMessages, // Sunucu mesajları için
    GatewayIntentBits.GuildMessageTyping, // Mesaj yazarak şeyler için
    GatewayIntentBits.MessageContent // Mesaj içeriğine ihtiyacınız varsa etkinleştirin
  ],
})

client.config = config;
client.player = new Player(client, client.config.opt.discordPlayer);
const player = client.player

fs.readdir("./events", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`Yüklenen Etkinlik: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = [];
fs.readdir(config.commandsDir, (err, files) => {
  if (err) throw err;
  files.forEach(async (f) => {
    try {
      let props = require(`${config.commandsDir}/${f}`);
      client.commands.push({
        name: props.name,
        description: props.description,
        options: props.options
      });
      console.log(`Yüklenen komut: ${props.name}`);
    } catch (err) {
      console.log(err);
    }
  });
});


player.on('trackStart', (queue, track) => {
  if (queue) {
    if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
    if (queue.metadata) {
      queue.metadata.send({ content: `🎵 Müzik çalmaya başladı: **${track.title}** -> Kanal: **${queue.connection.channel.name}** 🎧` }).catch(e => {
        console.error(e);
      });
    }
  }
});

player.on('trackAdd', (queue, track) => {
  if (queue) {
    if (queue.metadata) {
      queue.metadata.send({ content: `**${track.title}** Çalma listesine eklendi. ✅` }).catch(e => { })
    }
  }
});

player.on('channelEmpty', (queue) => {
  if (queue) {
    if (queue.metadata) {
      queue.metadata.send({ content: `Ses kanalımda kimse olmadığı için ses kanalından ayrıldım. ❌` }).catch(e => { })
    }
  }
});

player.on('queueEnd', (queue) => {
  if (client.config.opt.voiceConfig.leaveOnTimer.status === true) {
    if (queue) {
      setTimeout(() => {
        if (queue.connection) {
          if (!queue.playing) { //süre dolmadan yeni bir şey eklenmesi durumunda ek kontrol
            queue.connection.disconnect()
          }
        };
      }, client.config.opt.voiceConfig.leaveOnTimer.time);
    }
    if (queue.metadata) {
      queue.metadata.send({ content: `Tüm çalma sırası bitti, sanırım biraz daha müzik dinleyebilirsin. ✅` }).catch(e => { })
    }
  }
});

player.on("error", (queue, error) => {
  if (queue) {
    if (queue.metadata) {
      queue.metadata.send({ content: `Ses kanalına bağlanmaya çalışırken sorun yaşıyorum. ❌ | ${error}` }).catch(e => { })
    }
  }
})

if (TOKEN) {
  client.login(TOKEN).catch(e => {
    console.log("Projenize Girdiğiniz Bot Tokeni Yanlış Veya Botunuzun intents KAPALI!")
  })
} else {
  console.log("Lütfen botu glitchden yapmaya çalışmayın")
}

setTimeout(async () => {
  const db = require("croxydb")
  await db.delete("queue")
  await db.delete("loop")
}, 2000)

const express = require("express");
const app = express();
const http = require("http");
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
