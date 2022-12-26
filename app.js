const express = require('express');
const app = express();
const rtsp = require('rtsp-ffmpeg')
const boundary = '--5a22d388de01'

var uri = `rtsp://${process.env.TAPO_USER}:${process.env.TAPO_PW}@webcam.c100/stream2`

app.get("/", (req, res) => {
    var stream = new rtsp.FFMpeg({
        input: uri,
    })
    
    var stream_transform = (data) => {
        res.write(`${boundary}\nContent-type: image/jpeg\nContent-length: ${data.length}\n\n`) 
        res.write(data)
        res.write(`\n`)
    }
    res.status(200)
    res.setHeader('Content-Type', `multipart/x-mixed-replace; boundary=${boundary}`)
    res.setHeader('Pragma', 'no-cache')
    stream.on('data', stream_transform)
    req.on("close", () => {
        stream.removeListener('data', stream_transform)
        stream.stop()
        console.log("Client quit connection")
    })
});

app.listen(3001, () => {
    console.log("Listening on 3001")
})