import { convertAddress } from "./cosmosAddressConvertor.js"

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

// Convert address type
const cosmosNetwork = "celestia"
const baseCosmosUrl = `https://rest.cosmos.directory/${cosmosNetwork}/cosmos`
const address = "celestia1fzq595eyhdnstdm7g2stvqkj7fj99l5hehhvje"
console.log("Osmosis Address:", convertAddress(address, "osmo"))

Promise.all([])
const liquidBalancePromise = fetch(`${baseCosmosUrl}/bank/v1beta1/balances/${address}`)
const stakingBalancePromise = fetch(`${baseCosmosUrl}/staking/v1beta1/delegations/${address}`)
const rewardBalancePromise = fetch(`${baseCosmosUrl}/distribution/v1beta1/delegators/${address}/rewards`)

const DataPromise = await Promise.all([liquidBalancePromise, stakingBalancePromise, rewardBalancePromise])
const data = await Promise.all(DataPromise.map(response => response.json()))
console.log(data)

const liquidBalance = Number(data[0].balances[0].amount)
const stakingBalance = Number(data[1].delegation_responses[0].balance.amount)
const rewardBalance = Number(data[2].rewards[0].reward[0].amount)
console.log({liquidBalance})
console.log({stakingBalance})
console.log({rewardBalance})

const totalBalance = ((liquidBalance + stakingBalance + rewardBalance) / 1000000).toFixed(6)
console.log({tia: totalBalance})



