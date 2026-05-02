const TelegramBot = require('node-telegram-bot-api');
const { TOKEN } = require('./config');
const buttons = require('./buttons');
const data = require('./data');

const bot = new TelegramBot(TOKEN, { polling: true });

let userState = {};

function sendKeyboard(chatId, text, btns) {
  bot.sendMessage(chatId, text, {
    reply_markup: {
      keyboard: btns,
      resize_keyboard: true
    }
  });
}

// START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  userState[chatId] = {};

  bot.sendMessage(chatId,
`Hello Students,
Welcome to PM College of Excellence Bot.

This is not an official bot.
Please select your stream:`);

  sendKeyboard(chatId, "Choose:", buttons.streamButtons);
});

// FLOW
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!userState[chatId]) return;

  const state = userState[chatId];

  if (!state.stream && buttons.streamButtons.flat().includes(text)) {
    state.stream = text;
    return sendKeyboard(chatId, "Select Year:", buttons.yearButtons);
  }

  if (!state.year && buttons.yearButtons.flat().includes(text)) {
    state.year = text;
    return sendKeyboard(chatId, "Select Category:", buttons.categoryButtons);
  }

  if (!state.category && buttons.categoryButtons.flat().includes(text)) {
    state.category = text;

    const subjects = data
      .filter(d =>
        d.stream === state.stream &&
        d.year === state.year &&
        d.category === state.category
      )
      .map(d => d.subject);

    return sendKeyboard(chatId, "Select Subject:", subjects.map(s => [s]));
  }

  const result = data.find(d =>
    d.stream === state.stream &&
    d.year === state.year &&
    d.category === state.category &&
    d.subject === text
  );

  if (result) {
    bot.sendMessage(chatId,
`Subject: ${result.subject}
Date: ${result.date}
Time: ${result.time}`);
  }
});
