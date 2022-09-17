const express = require('express');
const app = express();
const rtsp = require('rtsp-ffmpeg')
const boundary = '--5a22d388de01'

var uri = `rtsp://${process.env.TAPO_USER}:${process.env.TAPO_PW}@webcam.c100/stream1`
var stream = new rtsp.FFMpeg({
    input: uri,
    rate: 15,
    quality: 3,
})

app.get("/", (req, res) => {
    res.status(200)
    res.setHeader('Content-Type', `multipart/x-mixed-replace; boundary=${boundary}`)
    res.setHeader('Connection', 'close')
    res.setHeader('Pragma', 'no-cache')
    stream.on('data',(data) => {
        res.write(`${boundary}\nContent-type: image/jpg\nContent-length: ${data.length}\n\n`) 
        res.write(data)
    })
    req.on("close", () => {
        console.log("Client quit connection")
    })
    req.on("end", () => {
        console.log("Client closed connection")
    })
});

app.listen(3001, () => {
    console.log("Listenting on 3001")
})