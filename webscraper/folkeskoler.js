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

module.exports  = (async () => { 
  async function getJob (url) {
   const page = await browser.newPage();
   await page.setDefaultNavigationTimeout(0);
   await page.setViewport({ width: 1280, height: 720 });
     await page.goto(url);
 
     const jobs = await page.evaluate(() =>
     Array.from(document.querySelectorAll(".document > .doc_entry")).map(jobs => ([
      jobs.querySelector('.doc_entry_desc > .school_name').innerText,
      jobs.querySelector('.doc_entry_logo > img').src,
      jobs.querySelector('.doc_entry_desc > .school_info').innerHTML.split(",")[0],
      jobs.querySelector('.doc_entry_desc > .school_info').innerText.split(",")[2].split("\n")[0].trim() ]))
     )
 
 
 // Skal man afslutte recursion
 if(jobs.length < 1){
 return jobs
 } else{
  const nextPageNumber = parseInt(url.match(/start=(\d+)$/)[1], 10) +20;
 if(nextPageNumber == 2880){
 return jobs
 }
  const nextUrl = `http://www.skoleliste.eu/type/grundskole/?region=&start=${nextPageNumber}`;
  return jobs.concat(await getJob(nextUrl));
 }
 };
 const browser = await puppeteer.launch({headless:false, slowMo:300});
 const firstUrl = "http://www.skoleliste.eu/type/grundskole/?region=&start=0"
 const schoolList = await getJob(firstUrl);


var sql = "INSERT INTO primarySchools(name, logo, type,city) VALUES ?";


connection.query(sql, [schoolList], function(err) {
    if (err) throw err;
    connection.end();
}); 


 await browser.close();
 })();
 
 
