const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Hridoy",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Admin",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭────────────────────╮
    🤖 BOT INFORMATION
╰────────────────────╯
➤ Name        : TORU CHAN
➤ Prefix      : ${config.PREFIX}
➤ Prefix Box  : ${prefix}
➤ Modules     : ${commands.size}
➤ Ping        : ${Date.now() - event.timestamp} ms

╭────────────────────╮
      👑 OWNER INFO
╰────────────────────╯
➤ Name        : Kakashi Hatake
➤ Facebook    : facebook.com/100061935903355
➤ Messenger   : m.me/100061935903355
➤ WhatsApp    : wa.me/+8801744-******

╭────────────────────╮
       📊ACTIVITIES
╰────────────────────╯
➤ Uptime      : ${hours}h ${minutes}m ${seconds}s
➤ Total Groups: ${totalThreads}
➤ Total Users : ${totalUsers}

──────────────────────
      KAKASHI HATAKE
──────────────────────`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/oEh5VEx.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
