require('./keep_alive.js');
const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client();

// --- الإعدادات ---
const GUILD_ID = '1264561928034975775';       // آيدي السيرفر
const AFK_CHANNEL_ID = '1496674424693325844'; // آيدي روم الـ AFK الصوتي
const TEXT_CHANNEL_ID = '1497214787493433545';// آيدي الروم الكتابي

// دالة للانضمام إلى الروم الصوتي
const connectToVoice = () => {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
        console.error("❌ لم يتم العثور على السيرفر، يرجى التأكد من صحة GUILD_ID");
        return;
    }

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
};

// دالة إرسال الرسائل الكتابية
const sendTextMessage = (content) => {
    const channel = client.channels.cache.get(TEXT_CHANNEL_ID);
    if (channel) {
        channel.send(content)
            .then(() => console.log(`✉️ تم إرسال الرسالة: "${content}"`))
            .catch((err) => console.error(`❌ فشل إرسال الرسالة "${content}":`, err));
    } else {
        console.error("❌ لم يتم العثور على الروم الكتابي.");
    }
};

client.on('ready', async () => {
    console.log(`✅ تم تسجيل الدخول بنجاح كـ: ${client.user.tag}`);
    
    // الدخول للروم الصوتي عند التشغيل
    connectToVoice();

    // إرسال كلمة "متجر" فور التشغيل ثم تكرارها كل دقيقة (60000 ملي ثانية)
    sendTextMessage("متجر");
    setInterval(() => {
        sendTextMessage("متجر");
    }, 60000);

    // إرسال كلمة "بخشيش" فور التشغيل ثم تكرارها كل 15 دقيقة (900000 ملي ثانية)
    sendTextMessage("بخشيش");
    setInterval(() => {
        sendTextMessage("بخشيش");
    }, 900000);
});

// ميزة الإعادة التلقائية عند الخروج أو التجميع/السحب
client.on('voiceStateUpdate', (oldState, newState) => {
    // التأكد أن الإجراء يخص حسابك أنت فقط
    if (oldState.id !== client.user.id) return;

    // إذا تم إخراجك من الروم أو نقلك إلى روم آخر غير روم الـ AFK
    if (newState.channelId !== AFK_CHANNEL_ID) {
        console.log("⚠️ تم رصد تغيير في الروم الصوتي (خروج أو نقل). إرجاع الحساب بعد 3 ثوانٍ...");
        
        setTimeout(() => {
            connectToVoice();
        }, 3000); // 3 ثوانٍ
    }
});

// تسجيل الدخول باستخدام التوكن من الـ Environment Variables
client.login(process.env.token);
