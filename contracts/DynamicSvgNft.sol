// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/tokens/ERC721/ERC721.sol";

contract DynamicSvgNft is ERC721 {
    uint public tokenCounter;
    string private i_lowImageUri;
    string private i_highImageUri;

    constructor(string memory lowSvg, string memory highSvg) ERC721("Dynamic SVG", "DSVG") {
        i_lowImageUri = lowSvg;
        i_highImageUri = highSvg;
    }

    function mint() public {
        _safeMint(msg.sender, tokenCounter);
        tokenCounter++;
    }
}
