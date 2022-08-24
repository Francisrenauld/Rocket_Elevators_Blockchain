// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RocketToken is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;
    uint cost =  0.01 ether; 
    Counters.Counter private _tokenIdCounter;
    mapping(address => bool) public freeNFTList;

    constructor() ERC721("RocketToken", "Rocket") {            
        freeNFTList[0x92A22470b1eC3DE435Da89E9f0B7183cEB2f3714] = true;
        freeNFTList[0x004660331dd96BfE95Ad4D32bf5EF7845a0Bc689] = true;
        freeNFTList[0xe578a5896931207AEb909Ba12EFc92b88422950a] = true;
        freeNFTList[0x4221ab4A5A1172FF48bB385d38fBa33453427957] = true;
        freeNFTList[0x4eeA12a0B97af76FaBDC91b76B1960173DC15e89] = true;
        freeNFTList[0x6c9e61363F48fEAc41f9a2469E54994Ce745E274] = true;
        freeNFTList[0xDf6EfD03c762374c1a840558dD9d3554B4fa3658] = true;
        freeNFTList[0x326a276b46BAaD8d1019fEd693B02ED0ad82FA01] = true;
        freeNFTList[0x78aDae76DB2FcC462Fe4AD58Eb2ED87a1bF05F9f] = true;
        freeNFTList[0x71c52f19d1cd0bC0a92663ab211E20a7a31Ad5BC] = true;

        }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
    
        function giveFreeNFT(address to, string memory uri) public payable{
        require(freeNFTList[to] == true, "You allready have your free NFT or your address is not permit to get a free NFT");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        freeNFTList[to] = false;
    }

    function safeMint(address to, string memory uri) public payable{
        require(msg.value >= cost, "Not enough ETH was sent");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

        function CheckAddress(address to) view public returns(string memory) {
          // bytes memory tempAddress = bytes(to);
            //require(freeNFTList[to] == true, "This address is not in the get free NFT list or no valid address is provided");
            if(freeNFTList[to] == true){
                return "This address can still get a free NFT!";
            }else{
                return "This address allready had a free NFT list or no valid address is provided";
            }
            
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

        function withdrawMoney() public onlyOwner{
        address payable to = payable(msg.sender);
        to.transfer(getBalance());
    }
}