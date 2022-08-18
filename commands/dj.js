const { ApplicationCommandOptionType } = require('discord.js');
const db = require('croxydb');
module.exports = {
    name: "dj",
    description: "DJ rolünü ayarlamanızı veya sıfırlamanızı sağlar.",
    permissions: "0x0000000000000020",
    options: [{
        name: "set",
        description: "Bir DJ rolü seçmenizi sağlar.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'role',
                description: 'Bir DJ rolünden bahsedin.',
                type: ApplicationCommandOptionType.Role,
                required: true
            }
        ]
    },
    {
        name: "reset",
        description: "DJ rolünü kapatmanızı sağlar.",
        type: ApplicationCommandOptionType.Subcommand,
        options: []
    }
    ],
    run: async (client, interaction) => {

        let stp = interaction.options.getSubcommand()
        if (stp === "set") {
            const role = interaction.options.getRole('role')
            if (!role) return interaction.reply("Bir DJ rolü belirtmezseniz, komutu kullanamazsınız!").catch(e => { });

            await db.set(`dj-${interaction.guild.id}`, role.id)
            return await interaction.reply({ content: "DJ rolü başarıyla ayarlandı <@&" + role + ">.", ephemeral: true }).catch(e => { });

        }
        if (stp === "reset") {
            const data = db.get(`dj-${interaction.guild.id}`)

            if (data) {
                await db.delete(`dj-${interaction.guild.id}`)
                return await interaction.reply({ content: "DJ rolü başarıyla silindi.", ephemeral: true }).catch(e => { });
            } else {
                return await interaction.reply({ content: "DJ rolü henüz belirlenmedi.", ephemeral: true }).catch(e => { });
            }

        }
    },
};
