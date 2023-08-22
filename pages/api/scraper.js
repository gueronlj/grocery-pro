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
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.safeway.com/');
  await page.waitForNavigation();
  await page.setViewport({width: 1440, height: 900});

  //====Close popup modal
  await console.log('Trying to close pop-up');
  let selector = '#onboardingCloseButton'
  await page.waitForSelector(selector, {timeout: 20000});
  await page.click(selector);
  await console.log('closed popup');
  
  //====Close popup modal #2
  await console.log('Trying to close pop-up 2');
  selector = '#onboardingCloseButton'
  await page.waitForSelector(selector, {timeout: 20000});
  await page.click(selector);
  await console.log('closed popup');
    

  //===Click on 'Change' to enter zipcode
  selector = '#openFulfillmentModalButton'
  await page.waitForSelector(selector, {timeout: 20000});
  await page.click(selector)
  await console.log('clicking change');

  //====Close popup modal #3
  await console.log('Trying to close pop-up 3');
  selector = '#onboardingCloseButton'
  await page.waitForSelector(selector, {timeout: 20000});
  await page.click(selector);
  await console.log('closed popup');

  //===Input local zipcode
  await console.log('Trying to input zipcode');
  selector = '::-p-xpath(/html/body/div[2]/div/div/div[3]/div/div/div/div/div[2]/store-fulfillment-modal-unified/div/div/div/div[2]/store-fulfillment-tabs/div/div[1]/input)'
  const ele = await page.waitForSelector(selector);
  ele.type('22041')
}

export default function handler(req, res) { 
  //getAldiAd(ZIPCODE);
  getSafewayAd(ZIPCODE);
  res.status(200).json({ specials: SPECIALS_LIST })
}