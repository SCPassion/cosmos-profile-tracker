import { mapNetworkToSymbol, mapNetworkToTokenName, convertAddress, fetchAllBalances } from "./cosmosUtilities.js"
import { fetchPrices } from "./fetchBinancePriceFeed.js"

const symbols = ["TIAUSDT", "OSMOUSDT", "ATOMUSDT"]

// const priceFeed = await fetchPrices(symbols)
// const priceFetcher = setInterval(async ()=>console.log(await fetchPrices(symbols)), 2000)

// setTimeout(()=> {
//     clearInterval(priceFetcher)
//     console.log("Stop fetching")
// }, 20000)

const celestiaAddress = "celestia18pl8klprl8ktqrwn86chw8l56kcw0mapp3x88x"
const address = celestiaAddress

// cosmos addresses
const selectedNetworks = ["celestia", "cosmoshub", "osmosis", "juno"]

const networkAddresses = getNetworkAddresses(selectedNetworks)
fetchAllBalances(networkAddresses)

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