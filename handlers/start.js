module.exports = (bot) => {
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
`🤖 Welcome to your bot!

Choose an option 👇`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📂 Menu", callback_data: "menu" }],
          [{ text: "ℹ️ About", callback_data: "about" }]
        ]
      }
    });
  });
};
