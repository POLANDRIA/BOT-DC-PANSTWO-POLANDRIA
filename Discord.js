client.on(Events.InteractionCreate, async (interaction) => {

  // klik button
  if (interaction.isButton()) {
    if (interaction.customId === "verify_btn") {

      const modal = new ModalBuilder()
        .setCustomId("verify_modal")
        .setTitle("Weryfikacja PIN");

      const input = new TextInputBuilder()
        .setCustomId("pin")
        .setLabel("Wpisz PIN")
        .setStyle(TextInputStyle.Short);

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);

      return interaction.showModal(modal);
    }
  }

  // submit PIN
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "verify_modal") {

      const code = interaction.fields.getTextInputValue("pin");

      if (code !== PIN) {
        return interaction.reply({
          content: "❌ Zły PIN",
          ephemeral: true
        });
      }

      const role = interaction.guild.roles.cache.get(ROLE_ID);

      if (!role) {
        return interaction.reply({
          content: "❌ Nie ma takiej roli",
          ephemeral: true
        });
      }

      await interaction.member.roles.add(role);

      return interaction.reply({
        content: "✔️ Masz rolę: Obywatel Polandrii",
        ephemeral: true
      });
    }
  }
});
