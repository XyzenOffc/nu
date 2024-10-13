// Script By WindHost
// Credit : WindaHosting
// Ch : https://whatsapp.com/channel/0029VafhQZ72Jl88eL0NpN30
// Tele : t.me/OsideGirl
// kalau mau rename, rename aja, asal jangan hapus credit yaa
//Jangan hapus credit ya mas / mbak

app.get('/client.html', (req, res) => {
    console.log('Akses ke client.html'); 
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    res.sendFile(path.join(__dirname, 'public', 'client.html')); 
});

// Script By WindHost
// Credit : WindaHosting
// Ch : https://whatsapp.com/channel/0029VafhQZ72Jl88eL0NpN30
// Tele : t.me/OsideGirl
// kalau mau rename, rename aja, asal jangan hapus credit yaa
//Jangan hapus credit ya mas / mbak