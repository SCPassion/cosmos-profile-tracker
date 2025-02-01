import { mapNetworkToSymbol, mapNetworkToTokenName, convertAddress, fetchAllBalances } from "./cosmosUtilities.js"
import { fetchPrices } from "./fetchBinancePriceFeed.js"

const symbols = ["TIAUSDT", "OSMOUSDT", "ATOMUSDT"]

const priceFeeds = await fetchPrices(symbols)

// How to fetch prices every 2 seconds continuously?
// const priceFetcher = setInterval(async ()=>console.log(await fetchPrices(symbols)), 2000)
// setTimeout(()=> {
//     clearInterval(priceFetcher)
//     console.log("Stop fetching")
// }, 20000)

const anyCosmosAddress = "celestia1d3zcy6zm69m23mewaw0ja96pjll8a2vflzz598"

// cosmos addresses
const selectedNetworks = ["celestia", "cosmoshub", "osmosis"]

const networkAddresses = getNetworkAddresses(selectedNetworks)
const totalBalance = await fetchBalances(networkAddresses)

console.log(totalBalance)

function getNetworkAddresses(selectedNetworks) {
    return selectedNetworks.map(cosmosNetwork => {
            return {
                networkName: cosmosNetwork, 
                tokenName: mapNetworkToTokenName[cosmosNetwork],
                address: convertAddress(anyCosmosAddress, mapNetworkToSymbol[cosmosNetwork])
            }
        }
    )
}

async function fetchBalances(networkAddresses) {
    const cosmosBalances =  await fetchAllBalances(networkAddresses)
    cosmosBalances.forEach(cosmosBalance => {
        const tokenSymbol = cosmosBalance.token.toUpperCase() + "USDT"
        cosmosBalance['usdBalance'] = priceFeeds[tokenSymbol] * cosmosBalance.balance
        cosmosBalance['currentTokenPrice'] = priceFeeds[tokenSymbol]
    })
    const totalBalance = cosmosBalances.reduce((total, balance) => total + balance.usdBalance, 0)
    return {cosmosBalances, totalBalance}
}