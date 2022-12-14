const express = require('express')
const app = express()
const axios = require('axios');
const fetch = require("node-fetch");
const port = 8080
const Web3 = require('web3');
//const provider = new Web3.providers.HttpProvider("https://blockchain.codeboxxtest.xyz");
const contract = require("@truffle/contract");
const HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "clap timber ranch solid toast wolf require glide cost inside giraffe negative"; // 12 word mnemonic
//var provider = new Web3(new HDWalletProvider(mnemonic, "http://blockchain.codeboxxtest.xyz"));

const provider = new Web3(new HDWalletProvider({
  mnemonic: {
    phrase: mnemonic
  },
  providerOrUrl: "https://blockchain.codeboxxtest.xyz"
}));
// Require the package that was previosly saved by @truffle/artifactor
const RocketTokenArtifact = require("./build/contracts/RocketToken.json");
const {
  response
} = require('express');
const RocketToken = contract(RocketTokenArtifact);
RocketToken.setProvider(provider.currentProvider)
// Remember to set the Web3 provider (see above).

// Note our MetaCoin contract exists at a specific address.
const contractAddress = "0x403684812a1666Cd70F448f044142c1AefbF8bb2";

const mergeImages = require("merge-images");
const {
  Canvas,
  Image
} = require("canvas");
let backgroundArray = new Array("images/background/1.png");
let earsArray = new Array("images/ears/1.png", "images/ears/2.png", "images/ears/3.png", "images/ears/4.png");
let eyesArray = new Array("images/eyes/1.png", "images/eyes/2.png", "images/eyes/3.png", "images/eyes/4.png");
let headArray = new Array("images/head/1.png", "images/head/2.png", "images/head/3.png");
let mouthArray = new Array("images/mouth/1.png", "images/mouth/2.png", "images/mouth/3.png", "images/mouth/4.png");
let mustacheArray = new Array("images/mustache/1.png", "images/mustache/2.png", "images/mustache/3.png", "images/mustache/4.png");
let noseArray = new Array("images/nose/1.png", "images/nose/2.png", "images/nose/3.png", "images/nose/4.png");
let pupilArray = new Array("images/pupil/1.png", "images/pupil/2.png", "images/pupil/3.png", "images/pupil/4.png");
const generateImage = async () => {
  //generate a random backgroud
  var randomNum = Math.floor(Math.random() * backgroundArray.length);
  randomBackground = backgroundArray[randomNum];
  //generate random ears
  var randomNum = Math.floor(Math.random() * earsArray.length);
  randomEars = earsArray[randomNum];
  //generate random eyes
  var randomNum = Math.floor(Math.random() * eyesArray.length);
  randomEyes = eyesArray[randomNum];
  //generate random head
  var randomNum = Math.floor(Math.random() * headArray.length);
  randomHead = headArray[randomNum];
  //generate random mouth
  var randomNum = Math.floor(Math.random() * mouthArray.length);
  randomMouth = mouthArray[randomNum];
  //generate random mustache
  var randomNum = Math.floor(Math.random() * mustacheArray.length);
  randomMustache = mustacheArray[randomNum];
  //generate random nose
  var randomNum = Math.floor(Math.random() * noseArray.length);
  randomNose = noseArray[randomNum];
  //generate random pupil
  var randomNum = Math.floor(Math.random() * pupilArray.length);
  randomPupil = pupilArray[randomNum];
  let b64 = await mergeImages([randomBackground, randomHead, randomEars, randomEyes, randomMouth, randomMustache, randomNose, randomPupil], {
    Canvas: Canvas,
    Image: Image,
  });
  return b64;
};

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getWalletTokens/:address', async (req, res) => {
  try {
    const instance = await RocketToken.at(contractAddress);
    let result = await instance.balanceOf(req.params.address);
    let uriTbl = [];
    for (let i = 0; i < result; i++) {
      let token = await instance.tokenOfOwnerByIndex(req.params.address, i);
      let uri = await instance.tokenURI(token);
      let result = await fetch(uri)
      let resultJson = await result.json();
      uriTbl.push(resultJson);

    }
    res.send(uriTbl)
  } catch (err) {
    res.send("not available")
  }
})

const uploadToIPFS = async (file, path) => {
  const response = await axios({
    method: 'POST',
    url: "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '6D7tHOPEXKrqN2t27rE81GVONUNvD2ic6o3DuEGhk0JRuokJYE8YB0JJRed6P4CC'
    },
    data: [{
      "path": path,
      "content": file
    }]
  });
  return response.data[0].path;
}

app.post('/giftNFT/:address', async (req, res) => {
  try {
    let accounts = await provider.eth.getAccounts();
    let mainAccount = accounts[0];
    const instance = await RocketToken.at(contractAddress);
    let tokenId = await instance.TokenId();
    let name = await instance.name();
    let image = await generateImage();
    let response1 = await uploadToIPFS(image, "RocketToken_" + tokenId + ".png")

    const object = {
      name: name + " #" + tokenId,
      description: "RocketToken Contract",
      image: response1
    };

    let str = JSON.stringify(object);
    let b64 = Buffer.from(str).toString("base64");
    let response2 = await uploadToIPFS(b64, "RocketToken_" + tokenId + ".json");
    let result = await instance.giveFreeNFT(req.params.address, response2, {
      from: mainAccount
    });
    res.json(response2)
  } catch (err) {
    res.send("not available")
  }
})

app.get('/getMetadata/:tokenId', async (req, res) => {
  try {
    const instance = await RocketToken.at(contractAddress);
    let result = await instance.tokenURI(req.params.tokenId);
    res.send(result)
  } catch (err) {
    res.send("not available")
  }
})

app.get('/getContractName', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let result = await instance.name();
  res.send(result)
})

app.get('/checkEligibleAddress/:address', async (req, res) => {
  try {
    const instance = await RocketToken.at(contractAddress);
    let check = await instance.CheckAddress(req.params.address);
    res.send(check)
  } catch (err) {
    res.send("not available")
  }
})

app.listen(process.env.PORT || 3000, port, () => {
  console.log(`Example app listening on port ${port}`);
});