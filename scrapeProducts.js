const puppeteer = require("puppeteer");
require("dotenv").config();

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

const scrapeProducts = async (products, res) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath()
    });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        let results = [];
        console.log(`Start Constructing ${products.length} items`)

        // await page.goto("https://shop.tiktok.com/view/product/1729401301598311205?region=US&locale=en")
        // await page.screenshot({ path: `ss.jpg` });
        // await page.waitForSelector(".index-item--XKK77");
        // const imgs = await page.$$eval('.index-item--XKK77 img[src]', imgs => imgs.map(img => img.getAttribute('src')));
        // res.status(200).json({ imgs })

        for (const pid of products) {
            // given pids only ------
            const url = `https://shop.tiktok.com/view/product/${pid}?region=US&locale=en`;
            // given whole url ------
            // const url = pid;
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            /**
                await page.goto(url, { waitUntil: 'load' });
                await page.goto(url, { waitUntil: 'domcontentloaded' });
                await page.goto(url, { waitUntil: 'networkidle0' });
                await page.goto(url, { waitUntil: 'networkidle2' });
             */
            const imgs = await page.$$eval('.index-item--XKK77 img[src]', imgs => imgs.map(img => img.getAttribute('src')));
            const productName = await page.evaluate((selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent : '';
            }, '.index-title--AnTxK');

            const price = await page.evaluate((selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent : '';
            }, '.index-price--hHzq8');
            let obj = {
                productName,
                // vendorName: "Sugu Shop",
                price,
                // influencerComission: "20%",
                pid,
                productLink: `https://shop.tiktok.com/view/product/${pid}?region=US&locale=en`,
                imageUrl: imgs.length > 0 ? imgs[0] : ""
            }
            results.push(obj)
            const randomDelayTime = Math.floor(Math.random() * (2000 + 1)) + 2000;
            await delay(randomDelayTime)
        }
        console.log(`FINISHED SCRAPING, YOU SCRAPED TOTAL OF ${results.length} Items`)
        res.status(200).json({ results })
    } catch (err) {
        console.error(err);
        res.send(`Something went wrong while running puppeteer: ${err}`)
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeProducts }