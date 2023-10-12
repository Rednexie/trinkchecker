const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const consoled = require("consoled.js")

const config = require("./config.json")

const path = require("path")
const fs = require("fs")

fs.writeFileSync(path.join("./tokens/valid.txt"),'', 'utf8')
fs.writeFileSync(path.join("./tokens/invalid.txt"), '', 'utf8')
fs.writeFileSync(path.join("./tokens/invalid.txt"), '', 'utf8')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


let valid = 0;
let locked = 0;
let invalid = 0;
let limited = 0;
let total = 0;







if(typeof config.rate !== "number") throw new Error("'./config.json'.rate should be a number");
const delay = 1000 / config.rate;
console.log(delay)
try{
  new URL(config.url);
}
catch(err){
  throw new Error("'./config.json'.url should be a valid url")
}





console.clear()
consoled.bright.cyan("[trinkchecker] Starting...")
process.title = "[trinkchecker] Starting..."

const tokens = fs.readFileSync(path.join("./tokens/tokens.txt"), 'utf-8').replace(/\r/g, '').split('\n');

consoled.bright.cyan("[trinkchecker] Readed tokens from: './tokens/tokens.txt'")
process.title = "[trinkchecker] Readed tokens from: './tokens/tokens.txt'"

const main = async () => {

  for(let i = 0; i < tokens.length; i++){
    await sleep(delay);
    check(tokens[i])
    process.title = `[trinkchecker] ${tokens.length - total} tokens left`;
  }
}
main();

consoled.bright.cyan(`[trinkchecker] Checking ${tokens.length} tokens...`)
process.title = `[trinkchecker] ${tokens.length} tokens left`;




async function check(token){
    total = total + 1;
    await sleep(delay);
    const response = await fetch(config.url, { headers: { "authorization": token, 'Content-Type': 'application/json'}})
    if(response.status == 401){
        consoled.bright.red("[trinkchecker] the token was invalid")
        fs.appendFileSync(path.join("./tokens/invalid.txt"), token + "\n", 'utf8')
        invalid = invalid + 1
        return
    }
    else if(response.status == 403){
      consoled.bright.yellow("[trinkchecker] the token was locked")
        fs.appendFileSync(path.join("./tokens/locked.txt"), token + "\n", 'utf8')
        locked = locked + 1
        return
    }
    else if(response.status == 429){
      consoled.red("[trinkchecker] rate limited")
        tokens.push(token)
        rate = rate + 1
        return
    }
    valid = valid + 1
    fs.appendFileSync(path.join("./tokens/valid.txt"), token + "\n", 'utf8')
    consoled.bright.green("[trinkchecker] valid token")
}



process.on('exit', () => {
  consoled.bright.blue("[trinkchecker] Done!")
  consoled.bright.blue("[trinkchecker] Total Checked Tokens: " + total)
  consoled.bright.blue("[trinkchecker] Valid Tokens: " + valid);
  consoled.bright.blue("[trinkchecker] Invalid Tokens: " + invalid);
  consoled.bright.blue("[trinkchecker] https://github.com/Rednexie/trinkchecker")
})
