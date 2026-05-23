require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ],
});

client.once("ready", () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.channelId || !newState.channelId) return;

  const alertChannel = newState.guild.channels.cache.get(process.env.ALERT_CHANNEL_ID);
  if (!alertChannel) return;

  const member = newState.member;
  const voiceChannel = newState.channel;

  if (voiceChannel.members.size === 1) {
    alertChannel.send(
      `@everyone    فتح كول يا جدعااااان ${member}`
    );
  } else {
    alertChannel.send(
      `@everyone   دخل الكوووول ${member} ياصلاة النبي`
    );
  }
});

client.login(process.env.TOKEN);