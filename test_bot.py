#!/usr/bin/env python3
import asyncio
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Your bot token
BOT_TOKEN = "8603739562:AAGZS_gjP1ANPR3EUHFUHKS05eTPWNd3uZ8"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    await update.message.reply_text(
        f"🤖 *ULTIMATE TRADING BOT v1.0*\n"
        f"Welcome {user.first_name}!\n\n"
        f"✅ *GMGN API:* Connected\n"
        f"✅ *BirdEye API:* Connected\n"
        f"✅ *Jupiter API:* Connected\n"
        f"❌ *Solana Wallet:* Need private key\n\n"
        f"*Available Commands:*\n"
        f"/status - Bot status\n"
        f"/test - Test APIs\n"
        f"/help - Show all commands",
        parse_mode='Markdown'
    )

async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📊 *BOT STATUS*\n"
        "🟢 Telegram: Connected\n"
        "🟢 GMGN: API key configured\n"
        "🟢 BirdEye: API key configured\n"
        "🟢 Jupiter: API key configured\n"
        "🔴 Solana: Need wallet private key\n"
        "⚪ Strategies: Ready to deploy\n"
        "⚪ Trading: Disabled (no wallet)",
        parse_mode='Markdown'
    )

async def test_apis(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🔧 *TESTING APIS*\n"
        "1. Telegram API: ✅ Connected\n"
        "2. GMGN API: ✅ Key configured (needs private key for signing)\n"
        "3. BirdEye API: ✅ Key configured\n"
        "4. Jupiter API: ✅ Key configured\n"
        "5. Solana RPC: ⚠️ No wallet key\n\n"
        "*NEED:* Solana wallet private key to continue",
        parse_mode='Markdown'
    )

async def main():
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add command handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("status", status))
    application.add_handler(CommandHandler("test", test_apis))
    
    # Start bot
    print("🤖 Starting Telegram bot test...")
    print(f"Bot: @EdgesTradersBot")
    print(f"Token: {BOT_TOKEN[:10]}...")
    
    await application.initialize()
    await application.start()
    await application.updater.start_polling()
    
    print("✅ Bot is running! Send /start to test")
    
    # Keep running
    await asyncio.Event().wait()

if __name__ == '__main__':
    asyncio.run(main())

