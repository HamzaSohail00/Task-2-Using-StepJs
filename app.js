const Step = require("step");
const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
//express
const app = express();
titlesProccessed = 0;
let GlobalRes;
let address = [];
//ejs settings
app.use(expressEjsLayouts);
app.set("view engine", "ejs");
app.get("/I/want/title/", (req, res) => {
  Step(
    function getReqRes() {
      address = req.query.address;
      arrayCheck = Array.isArray(address);
      if (!arrayCheck) {
        let temp = [];
        temp.push(address);
        address = temp;
      }
      if (address) {
        var group = this.group();
        address.forEach((url) => {
          checkUrlhttp = url.includes("http://");
          if (!checkUrlhttp) {
            let checkUrlhttps = url.includes("https://");
            if (!checkUrlhttps) {
              url = `https://${url}`;
            }
          }
          request(
            {
              url,
            },
            group() //stepjs
          );
        });
      }
    },
    function checkAddress(error, response) {
      let titles = [];
      titlesProccessed = 0;
      response.forEach((val) => {
        if (val) {
          let HtmlBody = val.body;
          let $ = cheerio.load(HtmlBody);
          t = $("title").text();
          titles.push(t);
          console.log("value" + titles);
        } else if (val === undefined) {
          titles.push("No Response");
        }
        titlesProccessed++;
        console.log("Titles Proccessed: " + titlesProccessed);
        console.log("address.length: " + address.length);
        if (titlesProccessed == address.length) {
          getTitles(titles);
        }
      });
      function getTitles(titles) {
        console.log("Titles" + address);
        res.render("layout", {
          address,
          titles,
        });
      }
    }
  );
});
app.get(["/*", "/I/*", "I/want/title/"], (req, res) => {
  //In case of any error
  res.status(404).send("404: Not found");
});
app.listen(4000, () => {
  console.log("Server is up on port 4000");
});
