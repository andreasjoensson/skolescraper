const puppeteer = require('puppeteer');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'database-1.cvpafmap9vzq.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Moreno92100.221',
  database: 'skoleAPI'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = (async () => { 
    const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto("https://elevpraktik.dk/ungdomsuddannelser");

    const skoler = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".posts-container > .post-container")).map(jobs => ([
      jobs.querySelector('.info-container > .post-title').innerText,
      'https://elevpraktik.dk/' + jobs.querySelector('.school-logo > img').dataset.src,
      jobs.querySelector('.post-name').innerText,
      jobs.querySelector('.info-container > span').innerText
    ]))
    )
    
    var sql = "INSERT INTO colleges(name, logo, type,city) VALUES ?";

connection.query(sql, [skoler], function(err) {
    if (err) throw err;
    connection.end();
}); 


await browser.close();
})();
