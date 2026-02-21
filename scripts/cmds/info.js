const fs = require("fs-extra");
const path = require("path");
const { utils } = global;

module.exports = {
  config: {
    name: "info",
    aliases: ["info"],
    version: "2.0",
    author: "Upgraded by You",
    role: 0,
    category: "Utility",
    guide: {
      en: "Use {p}upinfo to display full bot information."
    }
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      // ===== BOT INFO =====
      const BOTNAME = global.GoatBot.config.nickNameBot || "KakashiBot";
      const BOTPREFIX = global.GoatBot.config.prefix;
      const GROUPPREFIX = utils.getPrefix(event.threadID);
      const totalCommands = global.GoatBot.commands.size;

      // ===== OWNER INFO =====
      const ownerName = "Kakashi Hatake";
      const ownerFB = "facebook.com/100061935903355";
      const ownerMessenger = "m.me/100061935903355";
      const ownerWA = "wa.me/+8801744-******";

      // ===== UPTIME =====
      const uptimeSeconds = process.uptime();
      const days = Math.floor(uptimeSeconds / (60 * 60 * 24));
      const hours = Math.floor((uptimeSeconds % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const seconds = Math.floor(uptimeSeconds % 60);
      const uptimeString = `${days}D ${hours}H ${minutes}M ${seconds}S`;

      // ===== TOTAL USERS & GROUPS =====
      const totalUsers = global.GoatBot?.users ? Object.keys(global.GoatBot.users).length : 0;
      const totalThreads = global.GoatBot?.allThreadID?.length || 0;

      // ===== PING =====
      const ping = Date.now() - event.timestamp;

      // ===== BUILD MESSAGE =====
      const msg =
`╭─🌟 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
│
├🤖 Bot Name      : ${BOTNAME}
├💠 Bot Prefix    : ${BOTPREFIX}
├💬 Group Prefix  : ${GROUPPREFIX}
├📦 Modules       : ${totalCommands}
├⏱️ Ping          : ${ping} ms
│
╰─👑 OWNER INFO
├ Name           : ${ownerName}
├ Facebook       : ${ownerFB}
├ Messenger      : ${ownerMessenger}
├ WhatsApp       : ${ownerWA}
│
╭─📊 STATISTICS
├ Uptime         : ${uptimeString}
├ Total Groups   : ${totalThreads}
├ Total Users    : ${totalUsers}
╰───────────────◉`;

      // SEND MESSAGE
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error retrieving bot info.", event.threadID, event.messageID);
    }
  }
};
