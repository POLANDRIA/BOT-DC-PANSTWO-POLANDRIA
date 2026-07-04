const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// TWÓJ PIN
const PIN = "9873";

// ID roli którą dajesz
const ROLE_ID = "1522900074739273868";

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!verify")) {
    const args = message.content.split(" ");
    const code = args[1];

    if (code === PIN) {
      const role = message.guild.roles.cache.get(ROLE_ID);

      if (!role) return message.reply("Nie ma takiej roli.");

      await message.member.roles.add(role);
      message.reply("✔️ Dostęp przyznany.");
    } else {
      message.reply("❌ Zły PIN.");
    }
  }
});

client.login(process.env.TOKEN);
