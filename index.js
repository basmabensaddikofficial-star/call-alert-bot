require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ],
});

// Store ongoing calls
const activeCalls = new Map();

client.once("ready", () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {

  const alertChannel =
    newState.guild.channels.cache.get(process.env.ALERT_CHANNEL_ID);

  if (!alertChannel) return;

  const member = newState.member;
  const voiceChannel = newState.channel;

  // Someone JOINED a voice channel
  if (!oldState.channelId && newState.channelId) {

    // FIRST PERSON = CALL STARTED
    if (newState.channel.members.size === 1) {

      alertChannel.send(
        `@everyone فتح(ة) كول يا جدعااااان ${member}`
      );

      // Save who started the call
      activeCalls.set(newState.channel.id, {
        starter: member,
        lonelyTimer: setTimeout(() => {

          const channel = newState.guild.channels.cache.get(newState.channel.id);

          // If still alone after 5 minutes
          if (channel && channel.members.size === 1) {
            alertChannel.send(
              `@everyone 😭 فاتح(ة) كول بقاله شوية والناس عاملة ميتة ${member}`
            );
          }

        }, 5 * 60 * 1000) // 5 minutes
      });

    }

    // SOMEONE JOINED EXISTING CALL
    else {

      alertChannel.send(
        `@everyone 💃دخل(ت) الكوووول ${member} ياصلاة النبي`
      );

      const memberCount = newState.channel.members.size;

      // 2 PEOPLE MESSAGE
      if (memberCount === 2) {
        alertChannel.send(
          `@everyone 🙄في اتنين في الكول خاربينها نميمة في خلق الله… اللي عنده سيرة ييجي يلحق نفسه `
        );
      }

      // 5 PEOPLE MESSAGE
      if (memberCount === 5) {
        alertChannel.send(
          `@everyone 🔥 إيه الزحمة دي 😳 أروح أجيب رحاب حبيبتشي وجاي`
        );
      }
    }
  }
});

client.login(process.env.TOKEN);
