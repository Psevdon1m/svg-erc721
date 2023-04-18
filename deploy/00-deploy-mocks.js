const DECIMALS = "18"
const INITIAL_PRICE = ethers.utils.parseEther("2000")

module.exports = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (chainId == 31337) {
        log("local deployments. Mock is being deployed...")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mock is deployed")
    }
}

module.exports.tags = ["all", "mocks"]
