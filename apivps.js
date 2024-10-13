// Script By WindHost
// Credit : WindaHosting
// Ch : https://whatsapp.com/channel/0029VafhQZ72Jl88eL0NpN30
// Tele : t.me/OsideGirl
// kalau mau rename, rename aja, asal jangan hapus credit yaa
//Jangan hapus credit ya mas / mbak

const express = require('express');
const session = require('express-session');
const { NodeSSH } = require('node-ssh');
const http = require('http');
const WebSocket = require('ws'); 
const path = require('path'); 
const ping = require('ping'); 
const ssh = new NodeSSH(); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key', // Ganti dengan secret key yang kuat
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Daftar pengguna yang diizinkan (contoh)
const users = {
    admin: 'password123' // Ganti dengan username dan password yang diinginkan
};

// Masukkan vps kalian disini
const vpsList = [
    { host: 'ip_vps', username: 'root', password: 'passwd' },
    { host: 'ip_vps', username: 'root', password: 'passwd' },
    { host: 'ip_vps', username: 'root', password: 'passwd' },
    { host: 'ip_vps', username: 'root', password: 'passwd' },
    { host: 'ip_vps', username: 'root', password: 'passwd' }
];

app.get('/login', (req, res) => {
    res.send(`
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #003366;
                color: #fff;
                text-align: center;
                padding: 50px;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .login-box {
                background-color: rgba(0, 0, 0, 0.8); 
                border-radius: 10px; 
                padding: 20px; 
                width: 300px; 
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); 
            }
            input {
                padding: 10px;
                width: 100%;
                margin: 10px 0; 
                border-radius: 5px;
                border: none; 
                background-color: rgba(255, 255, 255, 0.8);
                color: #000; 
            }
            button {
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 100%; 
            }
            button:hover {
                background-color: #45a049;
            }
            h2 {
                color: #FFDD44;
                margin: 0; 
            }
            .error {
                color: #FF0000; 
                margin-top: 10px; 
            }
        </style>
        <div class="login-box">
            <h2>Login</h2>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            <div class="error">${req.query.error ? req.query.error : ''}</div> <!-- Menampilkan pesan error -->
        </div>
    `);
});

// Endpoint Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.user = username; 
        return res.redirect('/client.html'); 
    }
    res.redirect('/login?error=Username atau password salah.');
});

app.get('/client.html', (req, res) => {
    console.log('Akses ke client.html'); 
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    res.sendFile(path.join(__dirname, 'public', 'client.html')); 
});

async function checkVPSStatus() {
    const statusList = await Promise.all(vpsList.map(async (vps) => {
        const res = await ping.promise.probe(vps.host);
        return {
            host: vps.host,
            alive: res.alive
        };
    }));
    return statusList;
}
app.get('/list-vps', (req, res) => {
    res.send(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Daftar VPS</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #003366;
                    color: #fff;
                    text-align: center;
                    padding: 20px;
                }
                h1 {
                    color: #FFDD44; 
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); 
                }
                .container {
                    width: 80%;
                    margin: 0 auto; 
                    background-color: #000; 
                    border-radius: 10px; 
                    padding: 20px; 
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); 
                }
                table {
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px; 
                }
                th, td {
                    padding: 8px; 
                    text-align: center; 
                    color: #fff; 
                }
                th {
                    background-color: #4CAF50; 
                    color: white; 
                }
                tr:nth-child(even) {
                    background-color: #444; 
                }
                tr:hover {
                    background-color: #555; 
                }
                a {
                    color: #FFDD44; 
                    text-decoration: none;
                    font-weight: bold; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Daftar VPS</h1>
                <table>
                    <tr>
                        <th>Host</th>
                    </tr>
                    ${vpsList.map(vps => `
                        <tr>
                            <td>${vps.host}</td>
                        </tr>
                    `).join('')}
                </table>
                <br>
                <a href="/client.html">Kembali ke Halaman Kontrol</a>
            </div>
        </body>
        </html>
    `);
});
app.get('/vps-status', async (req, res) => {
    const vpsStatus = await checkVPSStatus(); 
    res.send(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Status VPS</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #003366; 
                    color: #fff; 
                    text-align: center;
                    padding: 20px;
                }
                h1 {
                    color: #FFDD44; 
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7); 
                }
                .container {
                    width: 80%;
                    margin: 0 auto; 
                    background-color: rgba(0, 0, 0, 0.8); 
                    border-radius: 10px; 
                    padding: 20px; 
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); 
                }
                table {
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px; 
                    text-align: center; 
                }
                th {
                    background-color: #4CAF50; 
                    color: white; 
                }
                tr:nth-child(even) {
                    background-color: #333; 
                }
                tr:hover {
                    background-color: #555; 
                }
                a {
                    color: #FFDD44;
                    text-decoration: none; 
                    font-weight: bold; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Status VPS</h1>
                <table>
                    <tr>
                        <th>Host</th>
                        <th>Status</th>
                    </tr>
                    ${vpsStatus.map(vps => `
                        <tr style="background-color: ${vps.alive ? '#dff0d8' : '#f2dede'};">
                            <td style="color: ${vps.alive ? 'black' : 'red'};">${vps.host}</td>
                            <td style="color: ${vps.alive ? 'green' : 'red'};">${vps.alive ? 'Online' : 'Mati'}</td>
                        </tr>
                    `).join('')}
                </table>
                <br>
                <a href="/client.html">Kembali ke Halaman Kontrol</a>
            </div>
        </body>
        </html>
    `);
});
server.listen(3000, () => {
    console.log('API Kontrol VPS berjalan di http://localhost:3000');
});

// Script By WindHost
// Credit : WindaHosting
// Ch : https://whatsapp.com/channel/0029VafhQZ72Jl88eL0NpN30
// Tele : t.me/OsideGirl
// kalau mau rename, rename aja, asal jangan hapus credit yaa
//Jangan hapus credit ya mas / mbak