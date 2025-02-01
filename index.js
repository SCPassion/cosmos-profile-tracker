import { convertAddress } from "./cosmosAddressConvertor.js"
import { mapNetworkToSymbol, mapNetworkToTokenName } from "./basicCosmosInformation.js"

const symbols = ["TIAUSDT", "OSMOUSDT", "ATOMUSDT"]
const apiUrl = "https://api.binance.com/api/v3/ticker/price?symbol="

async function fetchPrices(symbols) {
    const pricePromises = symbols.map(async (symb) => {
        const response = await fetch(apiUrl + symb)
        const data = await response.json()
        return { symb, price: data.price }
        }  
    );

    const prices = await Promise.all(pricePromises)
    const priceInfoArr = Object.fromEntries(prices.map(priceData => [priceData.symb, priceData.price]));
    console.log(priceInfoArr)
}

//const priceFetcher = setInterval(()=>fetchPrices(symbols), 2000)

// setTimeout(()=> {
//     clearInterval(priceFetcher)
//     console.log("Stop fetching")
// }, 20000)

const celestiaAddress = "celestia18pl8klprl8ktqrwn86chw8l56kcw0mapp3x88x"
const address = celestiaAddress

// cosmos addresses
const selectedNetworks = ["celestia", "cosmoshub", "osmosis", "juno"]

const networkAddresses = selectedNetworks.map(cosmosNetwork => {
        return {
            networkName: cosmosNetwork, 
            tokenName: mapNetworkToTokenName[cosmosNetwork],
            address: convertAddress(celestiaAddress, mapNetworkToSymbol[cosmosNetwork])
        }
    }
)

fetchAllBalances()

async function fetchAllBalances() {
    const balances = await Promise.all(networkAddresses.map(network => fetchBalance(network)))
    console.log(balances)
}

async function fetchBalance(cosmosNetwork) {
    const {networkName, tokenName, address} = cosmosNetwork
    const baseCosmosUrl = `https://rest.cosmos.directory/${networkName}/cosmos`

    try {
    const DataPromise = await Promise.all([
        fetch(`${baseCosmosUrl}/bank/v1beta1/balances/${address}`), 
        fetch(`${baseCosmosUrl}/staking/v1beta1/delegations/${address}`), 
        fetch(`${baseCosmosUrl}/distribution/v1beta1/delegators/${address}/rewards`)]
    )

    const [liquidData, stakingData, rewardData] = await Promise.all(DataPromise.map(response => response.json()))

    const liquidBalance = liquidData.balances.length > 0 ? Number(liquidData.balances.find(balances => balances.denom === "u" + tokenName).amount) / 1000000 : 0
    const stakingBalance = stakingData.delegation_responses.length > 0 ? Number(stakingData.delegation_responses[0].balance.amount) / 1000000 : 0
    const rewardBalance = rewardData.rewards.length > 0 ? Number(rewardData.rewards[0].reward[0].amount) / 1000000 : 0
    
    const totalBalance = ((liquidBalance + stakingBalance + rewardBalance)).toFixed(6)

    return {network: networkName, address: address, token: tokenName, balance: totalBalance}
    } catch (error) {
        console.error(`Error fetching balance for ${networkName}:`, error)
    }
}