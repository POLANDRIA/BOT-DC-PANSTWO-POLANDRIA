const { 
  Client, GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// 🔐 KONFIG
const PIN = "9873";
const ROLE_ID = "1522900074739273868";
const CHANNEL_ID = "1522724445712547880"; // <-- tu wpisz kanał

// 📢 EMBED + BUTTON
client.once("ready", async () => {
  console.log(`Zalogowano jako ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  const embed = new EmbedBuilder()
    .setTitle("🇵🇱 Weryfikacja Polandria")
    .setDescription("Kliknij przycisk i wpisz PIN, aby dostać rolę **Obywatel Polandrii**.")
    .setColor(0x2ecc71);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("verify_btn")
      .setLabel("Weryfikuj")
      .setStyle(ButtonStyle.Primary)
  );

  channel.send({ embeds: [embed], components: [row] });
});

// 🧠 INTERAKCJE
client.on(Events.InteractionCreate, async (interaction) => {

  // BUTTON
  if (interaction.isButton()) {
    if (interaction.customId === "verify_btn") {

      const modal = new ModalBuilder()
        .setCustomId("verify_modal")
        .setTitle("Weryfikacja PIN");

      const pinInput = new TextInputBuilder()
        .setCustomId("pin_input")
        .setLabel("Wpisz PIN")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(pinInput);
      modal.addComponents(row);

      return interaction.showModal(modal);
    }
  }

  // MODAL (PIN CHECK)
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "verify_modal") {

      const code = interaction.fields.getTextInputValue("pin_input");

      if (code !== PIN) {
        return interaction.reply({
          content: "❌ Zły PIN",
          ephemeral: true
        });
      }

      const role = interaction.guild.roles.cache.get(ROLE_ID);

      if (!role) {
        return interaction.reply({
          content: "❌ Nie znaleziono roli",
          ephemeral: true
        });
      }

      await interaction.member.roles.add(role);

      return interaction.reply({
        content: "✔️ Dostęp przyznany! Masz rolę Obywatel Polandrii",
        ephemeral: true
      });
    }
  }
});

// 🔑 LOGIN
client.login(process.env.TOKEN);
