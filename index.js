require('./keep_alive.js');
const { Client } = require('discord.js-selfbot-v13');

const client = new Client();

const token = process.env.token || process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const AFK_CHANNEL_ID = process.env.AFK_CHANNEL_ID;
const MEMORIES_CHANNEL_ID = process.env.MEMORIES_CHANNEL_ID;
const ECONOMY_CHANNEL_ID = process.env.ECONOMY_CHANNEL_ID;
const TASBEEH_RANDOM_CHANNEL_ID = process.env.TASBEEH_RANDOM_CHANNEL_ID;

if (!token) {
    console.error("❌ [CRITICAL ERROR]: متغير الـ token غير موجود!");
}

const connectToVoiceChannel = async () => {
    try {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) return;

        if (AFK_CHANNEL_ID) {
            await guild.shard.send({
                op: 4,
                d: {
                    guild_id: GUILD_ID,
                    channel_id: AFK_CHANNEL_ID,
                    self_mute: true,
                    self_deaf: false
                }
            });
            console.log(`🔊 [AFK SUCCESS]: تم التأفيك بنجاح.`);
        }
    } catch (error) {
        console.error("❌ [AFK ERROR]:", error);
    }
};

client.on('ready', async () => {
    console.log(`✅ [LOGIN SUCCESS]: ${client.user.tag}`);
    setTimeout(connectToVoiceChannel, 5000);
    startRotation();
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.id !== client.user.id) return;
    if (oldState.channelId && !newState.channelId) {
        setTimeout(connectToVoiceChannel, 2000);
    }
});

const startRotation = async () => {
    let economyTimer = 0;
    let randomTasbeehTimer = 0;

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.get(GUILD_ID);
            if (!guild) return;

            // 1. روم التسبيح العشوائي (كل 5 ثواني)
            if (Date.now() - randomTasbeehTimer > 5000) {
                if (TASBEEH_RANDOM_CHANNEL_ID) {
                    const channel = guild.channels.cache.get(TASBEEH_RANDOM_CHANNEL_ID);
                    if (channel) {
                        const azkar = ['سبحان الله', 'الحمد لله', 'الله أكبر', 'لا إله إلا الله', 'استغفر الله'];
                        const randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
                        await channel.send(randomZikr);
                    }
                }
                randomTasbeehTimer = Date.now();
                return;
            }

            // 2. روم الاقتصاد (!رصيد كل دقيقتين)
            if (Date.now() - economyTimer > 120000) {
                if (ECONOMY_CHANNEL_ID) {
                    const channel = guild.channels.cache.get(ECONOMY_CHANNEL_ID);
                    if (channel) {
                        await channel.send('!رصيد');
                    }
                }
                economyTimer = Date.now();
                return;
            }

            // 3. روم الذكريات (باقي الوقت)
            if (MEMORIES_CHANNEL_ID) {
                const memChannel = guild.channels.cache.get(MEMORIES_CHANNEL_ID);
                if (memChannel) {
                    await memChannel.send('!ذكريات');
                }
            }

        } catch (error) {
            console.error("❌ [ERROR]:", error);
        }
    }, 3000);
};

client.login(token);
