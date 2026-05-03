const TelegramBot = require('node-telegram-bot-api');
const { token } = require('./config/bot');

// handlers import
const startHandler = require('./handlers/start');
const callbackHandler = require('./handlers/callback');

const bot = new TelegramBot(token, { polling: true });

// load handlers
startHandler(bot);
callbackHandler(bot);

console.log("🤖 Bot is running...");
