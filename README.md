# DynamicSvgNft Contract

This contract is an implementation of a dynamic SVG-based non-fungible token (NFT) on the Ethereum blockchain. The NFTs created using this contract change their appearance based on the Chainlink price feed data.

## Features

- Mint NFTs with dynamic appearance based on price value.
- Retrieve the SVG data for the bear and bull versions of the NFT.
- Access the Chainlink price feed used to determine the appearance change.
- Get the name of the NFT collection.

## Prerequisites

Before using this contract, ensure that you have the following:

- Solidity compiler version 0.8.9 or compatible.
- OpenZeppelin ERC721 contract library.
- Chainlink AggregatorV3Interface contract.
- Base64-sol library for encoding SVG images.

## Installation

To use this contract, follow these steps:

1. Install the necessary dependencies and libraries, including OpenZeppelin, Chainlink, and Base64-sol.
2. Import the required libraries and interfaces into your project.
3. Deploy the DynamicSvgNft contract, providing the address of the Chainlink price feed, as well as the SVG data for the low and high versions.
4. Interact with the contract to mint NFTs, retrieve their SVG data, and access other contract functionalities.

## Usage

### Contract Initialization

The contract constructor requires the address of the Chainlink price feed and the SVG data for the bear and bull versions of the NFT. The constructor deploys the DynamicSvgNft contract, initializes the base ERC721 contract, and sets the bear and bull image URIs.

```solidity
constructor(
    address priceFeedAddress,
    string memory _lowSvg,
    string memory _highSvg
) ERC721("Dynamic SVG", "DSVG") {
    bearImageUri = svgToImageUri(_lowSvg);
    bullImageUri = svgToImageUri(_highSvg);
    i_priceFeed = AggregatorV3Interface(priceFeedAddress);
}
```

### Minting NFTs

Use the `mint` function to create new NFTs. Each NFT has a unique token ID and is associated with a specific value. The `mint` function increments the token counter, sets the value for the token ID, and assigns the NFT to the caller's address.

```solidity
function mint(int256 value) public {
    tokenCounter++;
    tokenIdToHighValue[tokenCounter] = value;
    _safeMint(msg.sender, tokenCounter);
    emit CreatedNFT(tokenCounter, value, msg.sender);
}
```

### Retrieving Token Metadata

The `tokenURI` function returns the metadata URI for a given token ID. The metadata includes the name, description, attributes, and image URI. The image URI is determined based on the Chainlink price feed data, where the bear or bull version is chosen accordingly.

```solidity
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
```

### Additional Functions

- `getBearSvg`: Retrieves the SVG data for the bear version of the NFT.
- `getBullSvg`: Retrieves the SVG data for the bull version of the NFT.
- `getPriceFeed`: Returns the address of the Chainlink price feed used by the contract.
- `getName`: Returns the name of the NFT collection.

## License

This contract is released under the UNLICENSED SPDX-License-Identifier.