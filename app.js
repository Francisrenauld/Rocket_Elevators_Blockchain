const express = require('express')
const app = express()
const axios = require('axios');
const port = 3000
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const contract = require("@truffle/contract");
// Require the package that was previosly saved by @truffle/artifactor
const RocketTokenArtifact = require("./build/contracts/RocketToken.json");
const {
  response
} = require('express');
const RocketToken = contract(RocketTokenArtifact);

// Remember to set the Web3 provider (see above).
RocketToken.setProvider(provider);

// Note our MetaCoin contract exists at a specific address.
const contractAddress = "0xD7084D69cBd08B5cc7718C98f48561E0f278b270";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getWalletTokens/:address', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let result = await instance.balanceOf(req.params.address);
  res.send(result)
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
  console.log(response.data)
  return response.data;
}

app.post('/giftNFT/:address', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let tokenId = await instance.TokenId();
  let name = await instance.name();
  let result = await instance.giveFreeNFT(req.params.address, "", {
    from: req.params.address
  });
  const object = {
    name: name + " #" + tokenId,
    description: "RocketToken Contract",
    image: "http"

  };
  let str = JSON.stringify(object);
  let b64 = Buffer.from(str).toString("base64");
  let response = await uploadToIPFS(b64, object.image);
  res.json(response)
})

app.get('/getMetadata/:tokenId', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let result = await instance.tokenURI(req.params.tokenId);
  res.send(result)
})

app.get('/getContractName', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let result = await instance.name();
  res.send(result)
})

app.get('/checkEligibleAddress/:address', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let check = await instance.CheckAddress(req.params.address);
  res.send(check)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})