const express = require("express");
const { scrapeLogic } = require('./scrapeLogic');
const { scrapeProducts } = require('./scrapeProducts');

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Render Puppeteer server is up and running")
})

app.get("/scrape", (req, res) => {
    scrapeLogic(res);
})

app.post('/scrapeProducts', async (req, res) => {
    const products = req?.body?.products
    scrapeProducts(products, res)
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})