const networkConfig = {
    31337: {
        name: "localhost",
        mintFee: "10000000000000000", // 0.01 ETH
    },

    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        // 500,000 gas
        mintFee: "10000000000000000", // 0.01 ETH
    },
    97: {
        name: "bnbtestnet",
        mintFee: "10000000000000000", // 0.01 ETH
    },
}

const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"
const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
}
