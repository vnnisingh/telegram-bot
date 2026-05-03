module.exports = (bot) => {
  bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;

    if (query.data === "menu") {
      bot.sendMessage(chatId, "📂 Main Menu is under development...");
    }

    if (query.data === "about") {
      bot.sendMessage(chatId, "ℹ️ This is a custom Telegram bot built by you.");
    }
  });
};
