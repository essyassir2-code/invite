require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

let invites = {};

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  for (const guild of client.guilds.cache.values()) {
    try {
      const fetchedInvites = await guild.invites.fetch();
      invites[guild.id] = fetchedInvites;
    } catch (err) {
      console.log(`❌ ما قدرش يجيب invites ديال ${guild.name}`);
    }
  }
});

client.on("guildMemberAdd", async (member) => {
  try {
    const newInvites = await member.guild.invites.fetch();
    const oldInvites = invites[member.guild.id];

    const inviteUsed = newInvites.find(inv => {
      const old = oldInvites?.get(inv.code);
      return old && inv.uses > old.uses;
    });

    if (!inviteUsed) return;

    invites[member.guild.id] = newInvites;

    const inviter = inviteUsed.inviter;

    const channel = member.guild.channels.cache.find(
      c => c.name === "invites" && c.isTextBased()
    );

    if (channel) {
      channel.send(`🎉 | ${member.user.tag} دخل بواسطة ${inviter.tag} و دابا عندو ${inviteUsed.uses} invites`);
    }

  } catch (err) {
    console.log("❌ Error:", err.message);
  }
});

client.login(process.env.TOKEN);
