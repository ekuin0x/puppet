const puppeteer = require('puppeteer');
const fs = require("fs")

const express = require("express");
const app = express();
const PORT = 3030;

app.get("/", (req, res)=>{
	setInterval(function(){
		const l = fs.readFileSync("links.json","utf-8")
		const links = JSON.parse(l)
		
		for(let i=0; i<2;i++){
			let link = links[Math.floor(Math.random(0,1) * links.length)]
			linkedin(link)
		}
	},15000)
})

const linkedin = async (link) => {
	console.log("launched")
	try {
		let f1 = fs.readFileSync("results.json","utf-8")
		let results = JSON.parse(f1);

		const browser = await puppeteer.launch({headless:true});
		await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")
		const page = await browser.newPage();
		await page.goto(link);
		await new Promise(resolve => setTimeout(resolve, 2500));
		const button = await page.$(".contextual-sign-in-modal__modal-dismiss-icon")
		await button.click()

		let Name = await page.$("h1")
		let name = await Name.evaluate(el => el.innerText)
		
		let Niche = await page.$("h2")
		let niche = await Niche.evaluate(el => el.innerText)


		let Address = await page.$("#address-0")
		let address = await Address.evaluate(el => el.innerText)	

		let About = await page.$("p[data-test-id='about-us__description']")
		let about = await About.evaluate(el => el.innerText)	

		if(address.includes("GB")){
			let emails = about.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
			if(emails != null){
				console.log(emails[0])
				let record = {
					"name" : name,
					"niche" : niche,
					"address" : address,
					"email" : emails[0],
					"source" : "blah"
				}	
			}
		}
		await browser.close()
		console.log("terminated")
	}
	catch{
		console.log("failed")
	}
};




app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
  });

