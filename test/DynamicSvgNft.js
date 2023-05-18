const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const {
    bearSVGImageUri,
    bullSVGImageUri,
    bearTokenUri,
    bullTokenUri,
} = require("../utils/base64Data")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Dynamic SVG Unit Test", () => {
          let accounts, deployer, dynamicSvgNft, mockV3Aggregator
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "dynamicSvgNft"])
              dynamicSvgNft = await ethers.getContract("DynamicSvgNft")
              mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
          })
          describe("constructor", () => {
              it("sets starting values", async () => {
                  const bearSvg = await dynamicSvgNft.getBearSvg()
                  const bullSvg = await dynamicSvgNft.getBullSvg()
                  const priceFeed = await dynamicSvgNft.getPriceFeed()

                  assert.equal(bearSvg, bearSVGImageUri)
                  assert.equal(bullSvg, bullSVGImageUri)
                  assert.equal(priceFeed, mockV3Aggregator.address)
              })
          })
          describe("mintNft", () => {
              it("emits an event and creates the NFT and returns bullish uri", async function () {
                  const highValue = ethers.utils.parseEther("1000") // 1 dollar per ether
                  await expect(dynamicSvgNft.mint(highValue)).to.emit(dynamicSvgNft, "CreatedNFT")
                  const tokenCounter = await dynamicSvgNft.tokenCounter()
                  assert.equal(tokenCounter.toString(), "1")
                  const tokenURI = await dynamicSvgNft.tokenURI(1)
                  assert.equal(tokenURI, bullTokenUri)
              })
              it("changes the token uri to bearish when the price lower than the highvalue", async function () {
                  const highValue = ethers.utils.parseEther("3000") // $3000 dollar per ether.
                  const txResponse = await dynamicSvgNft.mint(highValue)
                  await txResponse.wait(1)
                  const tokenURI = await dynamicSvgNft.tokenURI(1)
                  assert.equal(tokenURI, bearTokenUri)
              })
          })
      })
