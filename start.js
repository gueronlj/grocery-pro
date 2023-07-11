import puppeteer from "puppeteer";

const ZIPCODE = '22041';

const getAldiAd = async (zip) => {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto('https://stores.aldi.us/');
   await page.setViewport({width: 1440, height: 900});

   // Type into search box
   await page.waitForSelector('.search-input', {timeout: 10000});
   await page.type('.search-input', zip);
   await page.keyboard.press('Enter');

   // Wait and click on Store Details button
   let selector = '.Teaser-link';
   await page.waitForSelector(selector, {timeout: 10000});
   const options = await page.$$eval(selector, options => {
      return options.map(option => option.href);
   });
   const url = options[1];
   await page.goto(url);

   //Get URL for local store Ad.
   selector = '.Hero-cta--secondary';
   await page.waitForSelector(selector, {timeout: 10000});
   const ALDI_AD = await page.$eval(selector, ele => ele.href)
   console.log(ALDI_AD);
   await browser.close();
}

getAldiAd(ZIPCODE)