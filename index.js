const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalBlock } } = require('mineflayer-pathfinder');
const config = require('./settings.json');
require('./webserver');

let reconnectDelay = config.utils['auto-reconnect-delay'] || 30000;

function createBot() {
  const bot = mineflayer.createBot({
    username: config['bot-account'].username,
    password: config['bot-account'].password,
    auth: config['bot-account'].type,
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version,
    hideErrors: false
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('[BotLog] Bot joined the server!');
    reconnectDelay = config.utils['auto-reconnect-delay'] || 30000;

    if (config.utils['auto-auth'].enabled) {
      const password = config.utils['auto-auth'].password;
      setTimeout(() => {
        bot.chat(`/register ${password} ${password}`);
        bot.chat(`/login ${password}`);
        console.log('[Auth] Authentication commands sent.');
      }, 500);
    }

    if (config.utils['chat-messages'].enabled) {
      console.log('[INFO] Started chat-messages module');
      const messages = config.utils['chat-messages'].messages;
      const delay = config.utils['chat-messages']['repeat-delay'] * 1000;
      if (config.utils['chat-messages'].repeat) {
        let i = 0;
        setInterval(() => {
          bot.chat(messages[i]);
          i = (i + 1) % messages.length;
        }, delay);
      } else {
        messages.forEach(msg => bot.chat(msg));
      }
    }

    if (config.position.enabled) {
      const mcData = require('minecraft-data')(bot.version);
      const movements = new Movements(bot, mcData);
      bot.pathfinder.setMovements(movements);
      bot.pathfinder.setGoal(new GoalBlock(config.position.x, config.position.y, config.position.z));
      console.log(`[Pathfinder] Moving to (${config.position.x}, ${config.position.y}, ${config.position.z})`);
    }

    if (config.utils['anti-afk'].enabled) {
      bot.setControlState('jump', true);
      if (config.utils['anti-afk'].sneak) {
        bot.setControlState('sneak', true);
      }
      console.log('[INFO] Anti-AFK enabled.');
    }
  });

  bot.on('chat', (username, message) => {
    if (config.utils['chat-log']) {
      console.log(`[Chat] <${username}> ${message}`);
    }
  });

  bot.on('kicked', (reason) => {
    let reasonText = reason;
    try {
      const parsed = JSON.parse(reason);
      reasonText = parsed.text || parsed.translate || reason;
    } catch (e) {}

    console.log(`[BotLog] Bot was kicked: ${reasonText}`);

    if (config.utils['auto-reconnect']) {
      let delay = reconnectDelay;
      if (reasonText.toLowerCase().includes('throttled')) {
        delay = Math.min(reconnectDelay * 2, 120000);
        console.log(`[BotLog] Throttled! Waiting ${delay / 1000}s before reconnecting...`);
      } else {
        console.log(`[BotLog] Reconnecting in ${delay / 1000}s...`);
      }
      reconnectDelay = delay;
      setTimeout(createBot, delay);
    }
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
    if (config.utils['auto-reconnect']) {
      console.log(`[BotLog] Reconnecting in ${reconnectDelay / 1000}s...`);
      setTimeout(createBot, reconnectDelay);
    }
  });

  bot.on('end', () => {
    console.log('[BotLog] Connection ended.');
    if (config.utils['auto-reconnect']) {
      console.log(`[BotLog] Reconnecting in ${reconnectDelay / 1000}s...`);
      setTimeout(createBot, reconnectDelay);
    }
  });
}

createBot();
