import express from "express";
import fetch from "node-fetch"

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const cache = new Set();

app.get('/charger-station/:uuid', async (req, res) => {
    const API_KEY = "924fb7a29fc7ba631a12d0fd323409c2";
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));