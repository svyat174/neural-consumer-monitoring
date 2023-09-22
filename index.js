const axios = require('axios');
require('dotenv').config();

const login = process.env.LOGIN;
const password = process.env.PASSWORD;
const url = process.env.URL;

const botToken = process.env.BOT_TOKEN;

const chatId = process.env.CHAT_ID;

const checkInterval =  process.env.CHECK_INTERVAL;

let consecutiveHighCount = 0;
const maxConsecutiveHighCount = process.env.MAX_CONSECUTIVE_HIGH_COUNT;
const highThreshold = process.env.HIGH_THRESHOLD;

async function checkStatus() {
  try {
    const { data } = await axios.get(url, {
      auth: {
        username: login,
        password,
      },
    });

    console.log('data', data.length);

    if (data.length >= highThreshold) {
      consecutiveHighCount++;

      if (consecutiveHighCount >= maxConsecutiveHighCount) {
        await axios.post(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            chat_id: chatId,
            text: `*Conumers have been consistently more than 5 for 5 minutes.*`,
            parse_mode: 'Markdown',
          }
        );

        consecutiveHighCount = 0;
      }
    } else {
      consecutiveHighCount = 0;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

setInterval(checkStatus, checkInterval);
