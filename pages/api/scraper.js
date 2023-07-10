import puppeteer from 'puppeteer';

const ZIPCODE = '22041';

const scrape = async () => {

  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://stores.aldi.us/');
    console.log(page.url());


    // Set screen size
    await page.setViewport({width: 1440, height: 900});

    // Type into search box
    await page.type('.search-input', ZIPCODE);
    await page.keyboard.press('Enter');
    console.log('Typed the zipcode')

    // Wait and click on first result
    const x = await page.$("h3");
    const h3 = await page.evaluate(() =>{document.querySelector('h3').innerText});
    console.log(h3);


    const selector = '.Teaser-link';
 
    // const ele = '.Hero-cta--secondary';
    // await page.waitForSelector(ele, {timeout: 6000});
    // await page.click(ele);
    // console.log('clicked link to store add');

    await browser.close()

  } catch( err ) {
    console.log(err);
  } 
}

export default function handler(req, res) {
  scrape()
  res.status(200).json({ name: 'John Doe' })
}