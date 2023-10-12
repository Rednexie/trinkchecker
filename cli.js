const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readlineSync = require("readline-sync")
const consoled = require("consoled.js")