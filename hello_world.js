const express = require('express')
const app = express()
const port = 3000

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const contract = require("@truffle/contract");
// Require the package that was previosly saved by @truffle/artifactor
const RocketTokenArtifact = require("./build/contracts/RocketToken.json");
const RocketToken = contract(RocketTokenArtifact);

// Remember to set the Web3 provider (see above).
RocketToken.setProvider(provider);

// Note our MetaCoin contract exists at a specific address.
const contractAddress = "0x937aD93C31818a23AEC7B787abb73c0d623a421d";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getTokenName', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let result = await instance.name();
  res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


