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
const contractAddress = "0xB4a476Fa274b16B962f5576e640CcecAB0b88148";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getContractName', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let result = await instance.name();
  res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})