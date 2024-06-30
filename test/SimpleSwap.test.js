const { expect } = require("chai");
const { ethers } = require("hardhat");
//import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
//import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18;
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const ercAbi = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() public payable",
  "function approve(address spender, uint256 amount) returns (bool)",
];

describe("SimpleSwap", function () {
  it("Should provide a caller with more DAI than they started with after a swap", async function () {

    /* Deploy the SimpleSwap contract */
    const simpleSwapFactory = await ethers.getContractFactory('SimpleSwap')
    const simpleSwap = await simpleSwapFactory.deploy(SwapRouterAddress)
    //const simpleSwap = await hre.ethers.deployContract("SimpleSwap", [SwapRouterAddress])
   
    //await simpleSwap.deployed()

    //const simpleSwap = await simpleSwapFactory.deploy(SwapRouterAddress)
    /*
    const lock = await hre.ethers.deployContract("Lock", [_swapRouter], {
      value: lockedAmount,
    });
    const simpleSwap = await hre.ethers.deployContract("SimpleSwap", [SwapRouterAddress], {
      value: lockedAmount,
    }); */ 

    //const greeting = await simpleSwap.greet(); 
    await console.log("SimpleSwap deployed to: %s", simpleSwap.address)

    /* Connect to weth9 and wrap some eth  */
    let signers = await hre.ethers.getSigners()
    const WETH = new hre.ethers.Contract(WETH_ADDRESS, ercAbi, signers[0])
    //console.log("Transferring from %s to %s %s tokens", msg.sender, to, amount );
    console.log("WETH balance before:", await WETH.balanceOf(signers[0].address));
    const deposit = await WETH.deposit({ value: hre.ethers.parseEther('10') })
    await deposit.wait()
    console.log("WETH balance after:", await WETH.balanceOf(signers[0].address));

    /* Check Initial DAI Balance */
    const DAI = new hre.ethers.Contract(DAI_ADDRESS, ercAbi, signers[0])
    console.log("DAI balance before:", await DAI.balanceOf(signers[0].address));
    const expandedDAIBalanceBefore = await DAI.balanceOf(signers[0].address)
    const DAIBalanceBefore = Number(hre.ethers.formatUnits(expandedDAIBalanceBefore, DAI_DECIMALS))
    console.log("DAI balance before formatted:", await DAI.balanceOf(signers[0].address));

    /* Approve the swapper contract to spend weth9 for me */
    await WETH.approve(simpleSwap.address, hre.ethers.parseEther('1'))

    /* Execute the swap */
    const amountIn = hre.ethers.parseEther('0.1')
    const swap = await simpleSwap.swapWETHForDAI(amountIn, { gasLimit: 300000 })
    //swap.wait()
    console.log("DAI balance after:", await DAI.balanceOf(signers[0].address));

    /* Check DAI end balance */
    const expandedDAIBalanceAfter = await DAI.balanceOf(signers[0].address)
    const DAIBalanceAfter = Number(hre.ethers.utils.formatUnits(expandedDAIBalanceAfter, DAI_DECIMALS))

    /* Test that we now have more DAI than when we started */
    expect(DAIBalanceAfter).is.greaterThan(DAIBalanceBefore)

  });
});
