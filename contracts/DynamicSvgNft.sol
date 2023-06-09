// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

error DynamicSvgNft_NFT_NOT_EXIST();

contract DynamicSvgNft is ERC721 {
    uint public tokenCounter;
    string public constant NAME = "DynamicPriceNFT";
    string private bearImageUri;
    string private bullImageUri;
    string private constant base64EncodedSVGPrefix = "data:image/svg+xml;base64,";

    AggregatorV3Interface internal immutable i_priceFeed;
    mapping(uint256 => int256) public tokenIdToHighValue;

    event CreatedNFT(uint indexed tokenId, int256 highValue, address indexed owner);

    constructor(
        address priceFeedAddress,
        string memory _lowSvg,
        string memory _highSvg
    ) ERC721("Dynamic SVG", "DSVG") {
        bearImageUri = svgToImageUri(_lowSvg);
        bullImageUri = svgToImageUri(_highSvg);
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function svgToImageUri(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string.concat(base64EncodedSVGPrefix, svgBase64Encoded);
    }

    function mint(int256 value) public {
        tokenCounter++;
        tokenIdToHighValue[tokenCounter] = value;
        _safeMint(msg.sender, tokenCounter);
        emit CreatedNFT(tokenCounter, value, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert DynamicSvgNft_NFT_NOT_EXIST();
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        string memory imageUri = bearImageUri;
        if (price >= tokenIdToHighValue[tokenId]) {
            imageUri = bullImageUri;
        }
        return
            string.concat(
                _baseURI(),
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name:":"',
                            getName(),
                            '", "description":"An NFT that changes based on the Chainlink Deed.",',
                            '"attributes":[{"trait_type": "coolness", "value": 100}], "image":"',
                            imageUri,
                            '"}'
                        )
                    )
                )
            );
    }

    function getBearSvg() public view returns (string memory) {
        return bearImageUri;
    }

    function getBullSvg() public view returns (string memory) {
        return bullImageUri;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function getName() public pure returns (string memory) {
        return NAME;
    }
}
