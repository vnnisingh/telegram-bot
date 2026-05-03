const TelegramBot = require('node-telegram-bot-api');
const { TOKEN } = require('./config');
const data = require('./data');

const bot = new TelegramBot(TOKEN, { polling: true });

let userState = {};

// START
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userState[chatId] = {};

  bot.sendMessage(chatId,
`Hello Students,
Welcome to PM College Bot.

Please select your stream:`,
  {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "BA", callback_data: "BA" },
          { text: "BSC", callback_data: "BSC" }
        ],
        [
          { text: "BCOM", callback_data: "BCOM" },
          { text: "MSC", callback_data: "MSC" }
        ],
        [
          { text: "MA", callback_data: "MA" },
          { text: "MCOM", callback_data: "MCOM" }
        ]
      ]
    }
  });
});

// BUTTON CLICK HANDLE
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const text = query.data;

  if (!userState[chatId]) userState[chatId] = {};
  const state = userState[chatId];

  // BACK
  if (text === "back") {
    userState[chatId] = {};
    return bot.editMessageText("Select Stream:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "BA", callback_data: "BA" },
            { text: "BSC", callback_data: "BSC" }
          ],
          [
            { text: "BCOM", callback_data: "BCOM" },
            { text: "MSC", callback_data: "MSC" }
          ]
        ]
      }
    });
  }

  // STREAM
  if (!state.stream) {
    state.stream = text;

    return bot.editMessageText("Select Year:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "First Year", callback_data: "First Year" }],
          [{ text: "Second Year", callback_data: "Second Year" }],
          [{ text: "Third Year", callback_data: "Third Year" }],
          [{ text: "Final Year", callback_data: "Final Year" }],
          [{ text: "⬅️ Back", callback_data: "back" }]
        ]
      }
    });
  }

  // YEAR
  else if (!state.year) {
    state.year = text;

    return bot.editMessageText("Select Category:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Foundation", callback_data: "Foundation" }],
          [{ text: "Major", callback_data: "Major" }],
          [{ text: "Minor", callback_data: "Minor" }],
          [{ text: "⬅️ Back", callback_data: "back" }]
        ]
      }
    });
  }

  // CATEGORY
  else if (!state.category) {
    state.category = text;

    const subjects = data
      .filter(d =>
        d.stream === state.stream &&
        d.year === state.year &&
        d.category === state.category
      )
      .map(d => d.subject);

    if (!subjects.length) {
      return bot.editMessageText("Data not available ❌", {
        chat_id: chatId,
        message_id: messageId
      });
    }

    return bot.editMessageText("Select Subject:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          ...subjects.map(s => [{ text: s, callback_data: s }]),
          [{ text: "⬅️ Back", callback_data: "back" }]
        ]
      }
    });
  }

  // SUBJECT FINAL
  else {
    const result = data.find(d =>
      d.stream === state.stream &&
      d.year === state.year &&
      d.category === state.category &&
      d.subject === text
    );

    if (result) {
      return bot.editMessageText(
`📚 Subject: ${result.subject}

📅 Date: ${result.date}
⏰ Time: ${result.time}`,
        {
          chat_id: chatId,
          message_id: messageId
        }
      );
    }
  }
});
