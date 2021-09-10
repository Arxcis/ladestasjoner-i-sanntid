import express from "express";
import fetch from "node-fetch"
import http from "http";
import httpProxy from "http-proxy";

const API_KEY = "924fb7a29fc7ba631a12d0fd323409c2";

// Create server
// @see inspired by https://gist.github.com/hhanh00/ddf3bf62294fc420a0de
const app = express();
const proxy = httpProxy.createProxyServer({ 
    target: `ws://realtime.nobil.no/`, 
    ws: true,

});
const server = http.createServer(app);

// Add response header middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Proxy GET charger station
app.get('/charger-station/:uuid', async (req, res) => {
    const { params: { uuid }} = req;

    const body = JSON.stringify({
        apikey: API_KEY,
        apiversion: "3",
        action: "search",
        type: "id",
        id: uuid,
    });

    console.log(`GET /charger-station/${uuid}`)

    const nobilres = await fetch("https://nobil.no/api/server/search.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    })
    const json = await nobilres.json();

    res.json(json)
});

// Proxy websockets
server.on('upgrade', function (req, socket, head) {
    req.url = `${req.url}api/v1/stream?apikey=${API_KEY}`;

    console.info("proxying websocket upgrade request", req.url);

    proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`listening on ${PORT}`));