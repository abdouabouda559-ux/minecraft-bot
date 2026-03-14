const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Minecraft Bot</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #1a1a2e;
          color: #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background-color: #16213e;
          border-radius: 16px;
          padding: 40px 60px;
          text-align: center;
          box-shadow: 0 0 30px rgba(0,255,100,0.2);
        }
        .status {
          width: 20px;
          height: 20px;
          background: #00ff64;
          border-radius: 50%;
          display: inline-block;
          margin-left: 8px;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,255,100,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(0,255,100,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,255,100,0); }
        }
        h1 { font-size: 2rem; margin-bottom: 10px; }
        p { color: #aaa; font-size: 1rem; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🤖 Minecraft AFK Bot</h1>
        <p><span class="status"></span> البوت شغال الآن</p>
        <p style="margin-top:20px;">Server: <strong>abdouabouda559-IGy0.aternos.me</strong></p>
        <p>Uptime: <strong id="uptime">جاري التحميل...</strong></p>
      </div>
      <script>
        const start = Date.now();
        setInterval(() => {
          const elapsed = Math.floor((Date.now() - start) / 1000);
          const h = Math.floor(elapsed / 3600);
          const m = Math.floor((elapsed % 3600) / 60);
          const s = elapsed % 60;
          document.getElementById('uptime').textContent =
            h + 'h ' + m + 'm ' + s + 's';
        }, 1000);
      </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`[WebServer] يعمل على المنفذ ${port}`);
});
