const express = require('express');
const jwt = require('jsonwebtoken');
const Web3 = require('web3')
var fs = require('fs')
const axios = require('axios')
var abi = JSON.parse(fs.readFileSync('abi.json'))

// secret data
const protectedData = 'This is some private content.......<br><br>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

// constant string literals
const SECRET = 'jcndsiuhcdsiuchsdiuchdisucdis';
const message = 'Only sign this message for NFT Gateway POC.';

const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const nft = '0x0FEC56033F344A07A71Ce7861Ea00b2C3A9e4990'; // NFT contract address

const tokenExpiry = '15m';
const balanceRequired = 0;

// more globals
const app = express();
const web3 = new Web3(rpc);
let contract = undefined;

// get ABI and make contract
// we could axios fetch the contract ABI here or just load it from a local abi

// axios.get(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${nft}`).then(res => {
//     const abi = JSON.parse(res.data.result);
//     contract = new web3.eth.Contract(abi, nft);
// });

console.log('abi');
console.log(abi);

contract = new web3.eth.Contract(abi, nft);



app.use(express.json());

// set CORS support
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.get('/api/data', parseToken, (req, res) => {
    jwt.verify(req.token, SECRET, e => {
        if (e) res.sendStatus(403);
        else res.json(protectedData);
    });
});


app.post('/api/verify', (req, res) => {

    // authenticate as address owner
    let address;
    try {
        address = req.body.address;
        const signer = web3.eth.accounts.recover(message, req.body.signature);
        if (signer !== address) return res.sendStatus(401);
    } catch {
        return res.sendStatus(400);
    }

    // check for NFT
    if (!contract) return res.status(500).send('Server connecting to ethereum...');
    contract.methods.balanceOf(address).call((error, result) => {
        if (error) return res.status(500).send('Problem communicating with ethereum');
        if (parseFloat(result) > balanceRequired)
            jwt.sign(req.body, SECRET, { expiresIn: tokenExpiry }, (e, token) => {
                res.json({token});
            });
        else res.status(401).send(`NFT not owned. acquire token ${nft} for access.`)
    });
});

function parseToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader !== 'undefined') {
        req.token = authHeader.split(' ')[1];
        next();
    } else res.sendStatus(403);
}

app.listen(3005, () => console.log('Listening on port 3005...'));
