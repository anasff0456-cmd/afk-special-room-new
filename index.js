require('./keep_alive.js');
const { Client } = require('discord.js-selfbot-v13');

const client = new Client();

const token = process.env.token || process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const AFK_CHANNEL_ID = process.env.AFK_CHANNEL_ID;
const MEMORIES_CHANNEL_ID = process.env.MEMORIES_CHANNEL_ID;
const ECONOMY_CHANNEL_ID = process.env.ECONOMY_CHANNEL_ID;
const TASBEEH_CHANNEL_ID = process.env.TASBEEH_CHANNEL_ID;
const TASBEEH_RANDOM_CHANNEL_ID = process.env.TASBEEH_RANDOM_CHANNEL_ID;

if (!token) {
    console.error("❌ [CRITICAL ERROR]: متغير الـ token غير موجود في ريلواي!");
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
            console.log(`🔊 [AFK SUCCESS]: تم التأفيك بنجاح في الروم الصوتي مع ميوت.`);
        }
    } catch (error) {
        console.error("❌ [AFK ERROR]: حدث خطأ أثناء محاولة التأفيك الصوتي:", error);
    }
};

client.on('ready', async () => {
    console.log(`✅ [LOGIN SUCCESS]: تم تسجيل الدخول بنجاح كـ: ${client.user.tag}`);
    setTimeout(connectToVoiceChannel, 5000);
    startSmartRotation();
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.id !== client.user.id) return;
    if (oldState.channelId && !newState.channelId) {
        console.log("⚠️ [AFK NOTICE]: تم إخراجك من روم التأفيك! جاري العودة خلال ثانيتين...");
        setTimeout(connectToVoiceChannel, 2000);
    }
});

const startSmartRotation = async () => {
    let economyTimer = 0;
    let tasbeehTimer = 0;
    let randomTasbeehTimer = 0;

    console.log("⚙️ [SYSTEM]: تم تفعيل نظام التناوب الذكي للرسائل بنجاح.");

    setInterval(async () => {
        try {
            const guild = client.guilds.cache.get(GUILD_ID);
            if (!guild) return;

            // 1. روم التسبيح الرئيسي (قراءة دقيقة 100% لأخر رقم عبر جلب الرسائل مباشرة)
            if (Date.now() - tasbeehTimer > 62000) {
                if (TASBEEH_CHANNEL_ID) {
                    const channel = guild.channels.cache.get(TASBEEH_CHANNEL_ID);
                    if (channel) {
                        // جلب أحدث الرسائل مباشرة من السيرفر وليس الذاكرة المؤقتة
                        const msgs = await channel.messages.fetch({ limit: 5 });
                        let lastNum = 0;
                        
                        // ترتيب الرسائل من الأحدث إلى الأقدم وفحص محتواها
                        const sortedMsgs = Array.from(msgs.values()).sort((a, b) => b.createdTimestamp - a.createdTimestamp);
                        
                        for (const msg of sortedMsgs) {
                            const match = msg.content.match(/\d+/g);
                            if (match && match.length > 0) {
                                // أخذ آخر رقم موجود في أحدث رسالة
                                lastNum = parseInt(match[match.length - 1]);
                                break; 
                            }
                        }

                        const adkarList = [
                            'استغفر الله',
                            'سبحان الله',
                            'الحمد لله',
                            'لا إله إلا الله',
                            'الله أكبر',
                            'لا حول ولا قوة إلا بالله',
                            'سبحان الله وبحمده',
                            'سبحان الله العظيم'
                        ];
                        const randomZikr = adkarList[Math.floor(Math.random() * adkarList.length)];
                        const nextNum = lastNum + 1;

                        await channel.send(`${randomZikr} ${nextNum}`);
                        console.log(`📿 [TASBEEH]: تم إرسال (${randomZikr} ${nextNum}) - بناءً على الرقم السابق: ${lastNum}`);
                    }
                }
                tasbeehTimer = Date.now();
                return;
            }

            // 2. روم التسبيح العشوائي (كل 5 ثواني)
            if (Date.now() - randomTasbeehTimer > 5000) {
                if (TASBEEH_RANDOM_CHANNEL_ID) {
                    const channel = guild.channels.cache.get(TASBEEH_RANDOM_CHANNEL_ID);
                    if (channel) {
                        const azkar = ['سبحان الله', 'الحمد لله', 'الله أكبر', 'لا إله إلا الله', 'استغفر الله'];
                        const randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
                        await channel.send(randomZikr);
                        console.log(`✨ [RANDOM TASBEEH]: تم إرسال (${randomZikr})`);
                    }
                }
                randomTasbeehTimer = Date.now();
                return;
            }

            // 3. روم الاقتصاد (!رصيد كل دقيقتين)
            if (Date.now() - economyTimer > 120000) {
                if (ECONOMY_CHANNEL_ID) {
                    const channel = guild.channels.cache.get(ECONOMY_CHANNEL_ID);
                    if (channel) {
                        await channel.send('!رصيد');
                        console.log("💰 [ECONOMY]: تم إرسال أمر !رصيد بنجاح.");
                    }
                }
                economyTimer = Date.now();
                return;
            }

            // 4. روم الذكريات (باقي الوقت)
            if (MEMORIES_CHANNEL_ID) {
                const memChannel = guild.channels.cache.get(MEMORIES_CHANNEL_ID);
                if (memChannel) {
                    await memChannel.send('!ذكريات');
                    console.log("📜 [MEMORIES]: تم إرسال أمر !ذكريات بنجاح.");
                }
            }

        } catch (error) {
            console.error("❌ [ROTATION ERROR]: حدث خطأ داخل حلقة الإرسال والتناوب:", error);
        }
    }, 3000);
};

process.on('unhandledRejection', error => {
    console.error('❌ [UNHANDLED REJECTION]: خطأ غير معالج:', error);
});

client.login(token);
