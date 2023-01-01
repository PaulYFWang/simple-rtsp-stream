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
        res.write(`\nContent-type: image/jpeg\nContent-length: ${data.length}\n\n`) 
        res.write(data)
        res.write(`${boundary}`)
    }
    //res.status(200)
    res.setHeader('Content-Type', `multipart/x-mixed-replace; boundary=${boundary}`)
    res.setHeader('Pragma', 'no-cache')
    res.set("Connection", "close")
    res.write(`${boundary}`)
    stream.on('data', stream_transform)
    
    req.on("close", () => {
        stream.removeListener('data', stream_transform)
        stream.stop()
        res.socket.destroy()
        console.log("Client close connection")
    })
    req.on("end", () => {
        stream.removeListener('data', stream_transform)
        stream.stop()
        res.socket.destroy()
        console.log("Client end connection")
    })
});

app.listen(3001, () => {
    console.log("Listenting on 3001")
})