import telebot
from flask import Flask, request

TOKEN = "YOUR_BOT_TOKEN"
bot = telebot.TeleBot(TOKEN)

app = Flask(__name__)

# Start command
@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    btn1 = telebot.types.KeyboardButton("My Course")
    btn2 = telebot.types.KeyboardButton("My Exam")
    markup.add(btn1, btn2)

    bot.send_message(
        message.chat.id,
        "Hello Student 👋\n\n"
        "Ye Telegram Bot PM College of Excellence Makronia Sagar ke sabhi students ki help ke liye banaya gaya hai.\n\n"
        "Aapko jis bhi tarah ki help chahiye, please menu button se select kare.",
        reply_markup=markup
    )

# Menu handler
@bot.message_handler(func=lambda message: True)
def handle_message(message):
    if message.text == "My Course":
        bot.send_message(message.chat.id, "Course details yaha aayega.")

    elif message.text == "My Exam":
        bot.send_message(message.chat.id, "Exam details yaha aayega.")

    else:
        bot.send_message(message.chat.id, "Please menu se option select kare.")

# Webhook route
@app.route(f"/{TOKEN}", methods=["POST"])
def webhook():
    json_str = request.get_data().decode("UTF-8")
    update = telebot.types.Update.de_json(json_str)
    bot.process_new_updates([update])
    return "OK", 200

# Home route
@app.route("/")
def home():
    return "Bot is running!"

if __name__ == "__main__":
    bot.remove_webhook()
    bot.set_webhook(url=f"https://YOUR-RAILWAY-URL.up.railway.app/{TOKEN}")
    app.run(host="0.0.0.0", port=8000)
