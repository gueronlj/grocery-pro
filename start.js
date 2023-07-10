const puppeteer = require('puppeteer');

const ZIPCODE = '22041';

const scrape = async () => {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();

   try{
      await page.goto('https://stores.aldi.us/');
      console.log(page.url());

      await page.setViewport({width: 1440, height: 900});

      // Type into search box
      await page.waitForSelector('.search-input', {timeout: 5000});
      await page.type('.search-input', ZIPCODE);
      await page.keyboard.press('Enter');
      console.log('Typed the zipcode')

      // Wait and click on Store Details button
      let selector = '.Teaser-link';
      await page.waitForSelector(selector, {timeout: 5000});
      await page.click(selector);
      console.log('clicked store details button');

      const list = await page.evaluate(() => {
         Array.from(document.querySelectorAll('a'));
      })
      console.log(list);

   } catch(err) {
      console.log(err);
   }

  await browser.close()
}

scrape()