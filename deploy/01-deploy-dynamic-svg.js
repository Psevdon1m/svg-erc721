const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const fs = require("fs")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    let ethToUSDPriceFeed
    if (developmentChains.includes(network.name)) {
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethToUSDPriceFeed = EthUsdAggregator.address
    } else {
        ethToUSDPriceFeed = networkConfig[chainId].ethUsdPriceFeed
    }

    const lowSVG = fs.readFileSync("./images/bear.svg", { encoding: "utf8" })
    const highSVG = fs.readFileSync("./images/bull.svg", { encoding: "utf8" })
    args = [ethToUSDPriceFeed, lowSVG, highSVG]
    const dynamicSvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args,
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name)) {
        log("Verifying contract...")
        await verify(dynamicSvgNft.address, args)
        log(" Collecction is verified")
    }
}

module.exports.tags = ["all", "dynamicSvgNft", "main"]
