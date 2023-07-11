import puppeteer from "puppeteer";

const ZIPCODE = '22041';
const SPECIALS_LIST = [];

const getAldiAd = async (zip) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://stores.aldi.us/');
  await page.setViewport({width: 1440, height: 900});

  // Type into search box
  await page.waitForSelector('.search-input', {timeout: 20000});
  await page.type('.search-input', zip);
  await page.keyboard.press('Enter');

  // Wait and click on Store Details button
  let selector = '.Teaser-link';
  await page.waitForSelector(selector, {timeout: 20000});
  const options = await page.$$eval(selector, options => {
      return options.map(option => option.href);
  });
  const url = options[1];
  await page.goto(url);

  //Get URL for local store Ad.
  selector = '.Hero-cta--secondary';
  await page.waitForSelector(selector, {timeout: 20000});
  const adUrl = await page.$eval(selector, ele => ele.href)
  console.log(adUrl);
  await browser.close();
  SPECIALS_LIST.push(adUrl);
}

const getSafewayAd = async (zipcode) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.safeway.com/');
  await page.setViewport({width: 715, height: 676});
  console.log(page.url());

  let selector = '#openFulfillmentModalButton'
  await page.waitForSelector(selector, {timeout: 20000});
  await page.click(selector);
  
  selector = '.input-search'
  await page.waitForSelector(selector, {timeout: 5000});
  await page.type(selector, 'zipcode')
  await page.keyboard.press('Enter');

  selector = '.btn-primary'
  await page.waitForSelector(selector)
  const x = await page.$eval(selector, (ele) => {
    return ele.innerText;
  })
  await page.click(selector);
}

export default function handler(req, res) { 
  //getAldiAd(ZIPCODE);
  getSafewayAd(ZIPCODE);
  res.status(200).json({ specials: SPECIALS_LIST })
}