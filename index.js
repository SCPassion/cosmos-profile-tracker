import { convertAddress } from "./cosmosAddressConvertor.js"
import { mapNetworkToSymbol, mapNetworkToTokenName } from "./basicCosmosInformation.js"
import { fetchAllBalances } from "./fetchCosmosBalance.js"

// const symbols = ["TIAUSDT", "OSMOUSDT", "ATOMUSDT"]
// const apiUrl = "https://api.binance.com/api/v3/ticker/price?symbol="

// async function fetchPrices(symbols) {
//     const pricePromises = symbols.map(async (symb) => {
//         const response = await fetch(apiUrl + symb)
//         const data = await response.json()
//         return { symb, price: data.price }
//         }  
//     );

//     const prices = await Promise.all(pricePromises)
//     const priceInfoArr = Object.fromEntries(prices.map(priceData => [priceData.symb, priceData.price]));
//     console.log(priceInfoArr)
// }

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

fetchAllBalances(networkAddresses)