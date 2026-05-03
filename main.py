import telebot
from telebot.types import ReplyKeyboardMarkup, KeyboardButton

# Yaha apna Bot Token dal
TOKEN = "YOUR_BOT_TOKEN"

bot = telebot.TeleBot(TOKEN)

# Start command
@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = ReplyKeyboardMarkup(resize_keyboard=True)

    btn1 = KeyboardButton("My Course")
    btn2 = KeyboardButton("My Exam")

    markup.add(btn1, btn2)

    bot.send_message(
        message.chat.id,
        "Hello Student 👋\n\n"
        "Ye Telegram Bot PM College of Excellence Makronia Sagar ke sabhi students ki help ke liye banaya gaya hai.\n\n"
        "Aapko jis bhi tarah ki help chahiye, please menu button se select kare.",
        reply_markup=markup
    )

# Menu Handling
@bot.message_handler(func=lambda message: True)
def handle_message(message):
    if message.text == "My Course":
        bot.send_message(message.chat.id, "Aapka course details yaha dikhega (baad me add karenge).")

    elif message.text == "My Exam":
        bot.send_message(message.chat.id, "Aapka exam details yaha dikhega (baad me Google Sheet se connect karenge).")

    else:
        bot.send_message(message.chat.id, "Please menu se option select kare.")

# Run bot
bot.infinity_polling()
