import { mapNetworkToSymbol, mapNetworkToTokenName, convertAddress, fetchAllBalances } from "./cosmosUtilities.js"
import { fetchPrices } from "./fetchBinancePriceFeed.js"

const symbols = ["TIAUSDT", "OSMOUSDT", "ATOMUSDT"]

const priceFeeds = await fetchPrices(symbols)
// const priceFetcher = setInterval(async ()=>console.log(await fetchPrices(symbols)), 2000)

// setTimeout(()=> {
//     clearInterval(priceFetcher)
//     console.log("Stop fetching")
// }, 20000)

const celestiaAddress = "celestia1d3zcy6zm69m23mewaw0ja96pjll8a2vflzz598"
const address = celestiaAddress

// cosmos addresses
const selectedNetworks = ["celestia", "cosmoshub", "osmosis"]

const networkAddresses = getNetworkAddresses(selectedNetworks)
const totalBalance = await fetchBalances(networkAddresses)

console.log(await totalBalance)

function getNetworkAddresses(selectedNetworks) {
    return selectedNetworks.map(cosmosNetwork => {
            return {
                networkName: cosmosNetwork, 
                tokenName: mapNetworkToTokenName[cosmosNetwork],
                address: convertAddress(celestiaAddress, mapNetworkToSymbol[cosmosNetwork])
            }
        }
    )
}

async function fetchBalances(networkAddresses) {
    const cosmosBalances =  await fetchAllBalances(networkAddresses)
    const bal = cosmosBalances.map(cosmosBalance => {
        const tokenSymbol = cosmosBalance.token.toUpperCase() + "USDT"
        return { 
            network: cosmosBalance.network , 
            address: cosmosBalance.address, 
            usd: (priceFeeds[tokenSymbol] * cosmosBalance.balance)
        }
    })
    const totalBalance = bal.reduce((total, balance) => total + balance.usd, 0)
    return {priceFeeds, cosmosBalances, bal, totalBalance}
}



