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
const contractAddress = "0xeeBdD463851ec91dB742E24f3b703d651E25F1Da";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getWalletTokens/:address', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let result = await instance.balanceOf(req.params.address);
  res.send(result)
})

app.post('/buyToken/:address/:EthNumb', async (req, res) => {
  const instance = await RocketToken.at(contractAddress);
  let result = await instance.safeMint(req.params.address, "", {
    from: req.params.address,
    value: req.params.EthNumb
  });
  res.send(result)
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