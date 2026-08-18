const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// حالة البوت (افتراضياً يعمل)
let isBotActive = true;

app.get('/', (req, res) => {
    const statusText = isBotActive ? '🟢 البوت يعمل حالياً (متصل/AFK)' : '🔴 البوت متوقف حالياً';
    const statusColor = isBotActive ? '#2ecc71' : '#e74c3c';

    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>لوحة تحكم البوت</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; background-color: #121212; color: #ffffff; padding-top: 50px; margin: 0; }
                .card { background: #1e1e1e; display: inline-block; padding: 40px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); max-width: 400px; width: 90%; }
                h1 { margin-bottom: 15px; font-size: 1.8rem; }
                .status { font-size: 1.1rem; font-weight: bold; margin-bottom: 30px; color: ${statusColor}; border: 1px solid ${statusColor}; padding: 10px; border-radius: 8px; background-color: rgba(255,255,255,0.05); }
                .btn-group { display: flex; gap: 10px; justify-content: center; }
                .btn { flex: 1; padding: 14px 20px; font-size: 1rem; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; text-decoration: none; transition: background 0.3s ease; }
                .btn-start { background-color: #2ecc71; color: white; }
                .btn-start:hover { background-color: #27ae60; }
                .btn-stop { background-color: #e74c3c; color: white; }
                .btn-stop:hover { background-color: #c0392b; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🎙️ لوحة التحكم بالحساب</h1>
                <div class="status">${statusText}</div>
                <div class="btn-group">
                    <a href="/start" class="btn btn-start">▶️ تشغيل</a>
                    <a href="/stop" class="btn btn-stop">⏹️ إيقاف</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.get('/start', (req, res) => {
    isBotActive = true;
    res.redirect('/');
});

app.get('/stop', (req, res) => {
    isBotActive = false;
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`🌐 لوحة التحكم تعمل بنجاح على المنفذ: ${port}`);
});

module.exports = {
    getStatus: () => isBotActive
};
