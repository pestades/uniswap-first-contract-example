# Basic Uniswap Integration Environment to provide liquidity and swap, forking a mainnet (Ethereum or Base)

# open a terminal
git clone https://github.com/...
cd uniswap-hardhat-liquidity
npm install

#note: updated dependecies to hardhat and ethers, should be compatible with previous ones

# Execute on separate terminal, this will fork a mainnet
# Create free account on Alchemy  https://www.alchemy.com/ and set up an App in your prefered Block Chain
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/{YOUR_API_KEY}

# test the swap
npx hardhat test --network localhost