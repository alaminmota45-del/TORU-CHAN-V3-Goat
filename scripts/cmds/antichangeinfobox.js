const fs = require("fs-extra");
const path = require("path");
const { getStreamFromURL, uploadImgbb } = global.utils;

const antiPath = path.join(process.cwd(), "database", "data", "anti.json");

if (!fs.existsSync(path.dirname(antiPath))) {
  fs.mkdirSync(path.dirname(antiPath), { recursive: true });
}

if (!fs.existsSync(antiPath)) {
  fs.writeJsonSync(antiPath, {}, { spaces: 2 });
}

module.exports = {
  config: {
    name: "antichangeinfobox",
    version: "10.2", // Updated version for fixes
    author: "Hridoy ",
    role: 1,
    category: "Admin",
    shortDescription: "Anti-Change Group Protection + Lock + Nickname Fix",
    longDescription: "Protect group name, avatar, theme, emoji, nicknames, join/out with backup and lock system.",
    guide: {
      en: "{pn} → open menu\nReply with number 1-7 to toggle or 'lock' to toggle all"
    }
  },

  onStart: async function ({ message, event }) {
    const { threadID, senderID } = event;
    let data = fs.readJsonSync(antiPath);

    if (!data[threadID]) {
      data[threadID] = {
        name: false,
        avatar: false,
        nickname: false,
        theme: false,
        emoji: false,
        join: false,
        out: false,
        lock: false,
        backup: {}
      };
      fs.writeJsonSync(antiPath, data, { spaces: 2 });
    }

    const status = (v) => (v ? "🟢 ON" : "🔴 OFF");

    const menu = `
╭────────〔 ANTI SYSTEM 〕
│
│ 1 → Anti Name     : ${status(data[threadID].name)}
│ 2 → Anti Avatar   : ${status(data[threadID].avatar)}
│ 3 → Anti Nickname : ${status(data[threadID].nickname)}
│ 4 → Anti Theme    : ${status(data[threadID].theme)}
│ 5 → Anti Emoji    : ${status(data[threadID].emoji)}
│ 6 → Anti Join     : ${status(data[threadID].join)}
│ 7 → Anti Out      : ${status(data[threadID].out)}
│ 🔒 lock → All toggle: ${status(data[threadID].lock)}
│
╰───────────────
Reply with a number (1-7) or 'lock'`;

    message.reply(menu, (err, info) => {
      if (err) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: senderID,
        threadID
      });
    });
  },

  onReply: async function ({ api, event, message }) {
    const { threadID, body } = event;
    const choice = body.trim().toLowerCase();
    let data = fs.readJsonSync(antiPath);
    if (!data[threadID]) return;
    if (!data[threadID].backup) data[threadID].backup = {};

    const keyMap = {
      "1": "name",
      "2": "avatar",
      "3": "nickname",
      "4": "theme",
      "5": "emoji",
      "6": "join",
      "7": "out"
    };

    // LOCK system
    if (choice === "lock") {
      const newLockState = !data[threadID].lock;
      data[threadID].lock = newLockState;
      for (const k of Object.values(keyMap)) data[threadID][k] = newLockState;

      // Backup if turning ON
      if (newLockState) {
        const threadInfo = await api.getThreadInfo(threadID).catch(() => null);
        if (threadInfo) {
          try {
            data[threadID].backup.name = threadInfo.threadName || "";
            if (threadInfo.imageSrc) {
              const img = await uploadImgbb(threadInfo.imageSrc).catch(() => null);
              data[threadID].backup.avatar = img?.image?.url || "";
            }
            data[threadID].backup.nickname = { ...threadInfo.nicknames };
            data[threadID].backup.theme = threadInfo.color || ""; // Use color if threadThemeID not available
            data[threadID].backup.emoji = threadInfo.emoji || "";
          } catch (e) {
            console.log("[Anti Lock] Backup error:", e);
          }
        }
      }

      fs.writeJsonSync(antiPath, data, { spaces: 2 });
      return message.reply(`🔒 Lock ${newLockState ? "ENABLED" : "DISABLED"} → All protections toggled`);
    }

    // Individual toggle
    if (!["1","2","3","4","5","6","7"].includes(choice)) {
      return message.reply("❌ Please reply with a valid number (1-7) or 'lock'");
    }

    const...