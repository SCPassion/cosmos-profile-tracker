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
const selectedNetworks = ["celestia", "cosmoshub", "osmosis"]

const networkAddresses = selectedNetworks.map(cosmosNetwork => {
        return {
            networkName: cosmosNetwork, 
            tokenName: mapNetworkToTokenName[cosmosNetwork],
            address: convertAddress(celestiaAddress, mapNetworkToSymbol[cosmosNetwork])
        }
    }
)

networkAddresses.map(network => {
    return fetchBalance(network)
})

async function fetchBalance(cosmosNetwork) {
    const {networkName, tokenName, address} = cosmosNetwork
    const baseCosmosUrl = `https://rest.cosmos.directory/${networkName}/cosmos`

    const DataPromise = await Promise.all([
        fetch(`${baseCosmosUrl}/bank/v1beta1/balances/${address}`), 
        fetch(`${baseCosmosUrl}/staking/v1beta1/delegations/${address}`), 
        fetch(`${baseCosmosUrl}/distribution/v1beta1/delegators/${address}/rewards`)]
    )

    const [liquidData, stakingData, rewardData] = await Promise.all(DataPromise.map(response => response.json()))

    const liquidBalance = Number(liquidData.balances.find(balances => balances.denom === "u" + tokenName).amount) / 1000000
    const stakingBalance = stakingData.delegation_responses.length > 0 ? Number(stakingData.delegation_responses[0].balance.amount) / 1000000 : 0
    const rewardBalance = rewardData.rewards.length > 0 ? Number(rewardData.rewards[0].reward[0].amount) / 1000000 : 0
    
    console.log({liquidBalance, stakingBalance, rewardBalance})

    const totalBalance = ((liquidBalance + stakingBalance + rewardBalance)).toFixed(6)
    console.log({network: networkName, token: tokenName, balance: totalBalance})

}

// // Single address balance
// const cosmosNetwork = "celestia"
// const baseCosmosUrl = `https://rest.cosmos.directory/${cosmosNetwork}/cosmos`

// const liquidBalancePromise = fetch(`${baseCosmosUrl}/bank/v1beta1/balances/${address}`)
// const stakingBalancePromise = fetch(`${baseCosmosUrl}/staking/v1beta1/delegations/${address}`)
// const rewardBalancePromise = fetch(`${baseCosmosUrl}/distribution/v1beta1/delegators/${address}/rewards`)

// const DataPromise = await Promise.all([liquidBalancePromise, stakingBalancePromise, rewardBalancePromise])
// const data = await Promise.all(DataPromise.map(response => response.json()))

// const liquidBalance = Number(data[0].balances[0].amount)
// const stakingBalance = Number(data[1].delegation_responses[0].balance.amount)
// const rewardBalance = Number(data[2].rewards[0].reward[0].amount)

// const totalBalance = ((liquidBalance + stakingBalance + rewardBalance) / 1000000).toFixed(6)
// console.log({tia: totalBalance})



