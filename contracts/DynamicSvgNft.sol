// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/tokens/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721 {
    uint public tokenCounter;
    string private i_lowImageUri;
    string private i_highImageUri;
    string private constant base64EncodedSVGPrefix = 'data:image/svg+xml;base64,'

    constructor(string memory lowSvg, string memory highSvg) ERC721("Dynamic SVG", "DSVG") {
        i_lowImageUri = lowSvg;
        i_highImageUri = highSvg;
    }

    function svgToImageUri(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacekd(svg))))
        return string.concat(base64EncodedSVGPrefix, svgBase64Encoded)
    }

    function mint() public {
        _safeMint(msg.sender, tokenCounter);
        tokenCounter++;
    }
}
