require('./keep_alive.js');
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client();

// --- الإعدادات ---
const GUILD_ID = '1264561928034975775';       // ايدي السيرفر
const AFK_CHANNEL_ID = '1496674424693325844'; // ايدي روم الـ AFK الصوتي

client.on('ready', async () => {
    console.log(`✅ تم تسجيل الدخول بنجاح كـ: ${client.user.tag}`);
    
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
        console.error("❌ لم يتم العثور على السيرفر، يرجى التأكد من صحة GUILD_ID");
        return;
    }

    // الانضمام إلى الروم الصوتي (Muted/Deafened تلقائياً)
    try {
        joinVoiceChannel({
            channelId: AFK_CHANNEL_ID,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfMute: true,
            selfDeaf: false
        });
        console.log(`🔊 تم الدخول إلى روم الـ AFK بنجاح.`);
    } catch (error) {
        console.error("❌ حدث خطأ أثناء الدخول للروم الصوتي:", error);
    }
});

// تسجيل الدخول باستخدام التوكن من الـ Environment Variables
client.login(process.env.token);
