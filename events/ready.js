const config = require("../config.js");
module.exports = async (client) => {

    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v10");
    const rest = new REST({ version: "10" }).setToken(config.TOKEN || process.env.TOKEN);
    (async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: await client.commands,
            });
            console.log("Uygulama [/] komutları başarıyla yeniden yüklendi.");
        } catch (err) {
            console.log("Uygulama [/] komutları yeniden yüklenirken hata oluştu: " + err);
        }
    })();

    console.log(client.user.username + " Başarılı şekilde bağlandı.");
    client.user.setStatus('ONLINE');
    client.user.setActivity(config.status)

}
