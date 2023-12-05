const puppeteer = require("puppeteer");

const scrapeLogic = async (res) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        // Navigate the page to a URL
        await page.goto('https://developer.chrome.com/');
        // Set screen size
        await page.setViewport({ width: 1080, height: 1024 });
        await page.waitForSelector(".devsite-landing-row-header-text");

        const fullTitle = await page.evaluate(() => {
            const textToFetch = document.querySelector(".devsite-landing-row-header-text")
            return textToFetch ? textToFetch.textContent : "";
        })
        // Print the full title
        console.log('The title of this blog post is "%s".', fullTitle);
        res.send(fullTitle);
    } catch (err) {
        console.error(err);
        res.send(`Something went wrong while running puppeteer: ${err}`)
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeLogic }