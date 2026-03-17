const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

let invites = {};

client.on("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  client.guilds.cache.forEach(async (guild) => {
    const guildInvites = await guild.invites.fetch();
    invites[guild.id] = guildInvites;
  });
});

client.on("guildMemberAdd", async (member) => {

  const newInvites = await member.guild.invites.fetch();
  const oldInvites = invites[member.guild.id];

  const inviteUsed = newInvites.find(inv => {
    const old = oldInvites.get(inv.code);
    return old && inv.uses > old.uses;
  });

  // حماية من الكراش
  if (!inviteUsed) return;

  invites[member.guild.id] = newInvites;

  const inviter = inviteUsed.inviter;

  // بدّل اسم الشانيل هنا إلا بغيتي
  const channel = member.guild.channels.cache.find(
    c => c.name === "invites" && c.isTextBased()
  );

  if (channel) {
    channel.send(`🎉 | ${member.user.tag} دخل بواسطة ${inviter.tag} و دابا عندو ${inviteUsed.uses} invites`);
  }
});

client.login("MTQ4MzQzNzYxNzc5Mjk0MjI5NQ.GU9iN-.teM-Ja9aBh2dR-HbBWGIuhvdg4CT1kOexD3SJ0");
