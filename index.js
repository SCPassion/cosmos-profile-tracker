import { mapNetworkToSymbol, mapNetworkToTokenName, convertAddress, fetchAllBalances } from "./cosmosUtilities.js"
import { fetchPrices } from "./fetchBinancePriceFeed.js"

const cosmosAddressInputEl = document.getElementById('cosmos-address')
const portfolioEl = document.getElementById('portfolio')
const portfolioBodyEl = document.getElementById('portfolio-body')
const portfolioFooterEl = document.getElementById('portfolio-footer')

const symbols = ["TIAUSDT", "OSMOUSDT", "ATOMUSDT", "SAGAUSDT"]
const selectedNetworks = ["celestia", "cosmoshub", "osmosis", "saga"]

let baseTableHeader = `
    <thead>
        <tr>
            <th>Token</th>
            <th>Price in USD</th>
            <th>Amount</th>
            <th>Total Value</th>
        </tr>
    </thead>
`

// How to fetch prices every 2 seconds continuously?
// const priceFetcher = setInterval(async ()=>console.log(await fetchPrices(symbols)), 2000)
// setTimeout(()=> {
//     clearInterval(priceFetcher)
//     console.log("Stop fetching")
// }, 20000)

// const anyCosmosAddress = "celestia1d3zcy6zm69m23mewaw0ja96pjll8a2vflzz598"

// cosmos addresses

document.addEventListener('submit', async (e) => {
    e.preventDefault()

    const cosmosAddress = cosmosAddressInputEl.value
    cosmosAddressInputEl.value = ""

    const networkAddresses = getNetworkAddresses(cosmosAddress, selectedNetworks)
    const totalBalance = await fetchBalances(networkAddresses)

    const porttableRows = getProtfolioTableRowsHTML(totalBalance)
    const totalBalanceRow = getProtfolioTotalBalanceRowHTML(totalBalance)
    
    portfolioBodyEl.innerHTML = porttableRows
    portfolioFooterEl.innerHTML = totalBalanceRow

    portfolioEl.classList.remove('hidden')
});

function getNetworkAddresses(anyCosmosAddress, selectedNetworks) {
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
    const priceFeeds = await fetchPrices(symbols)
    const cosmosBalances =  await fetchAllBalances(networkAddresses)
    cosmosBalances.forEach(cosmosBalance => {
        const tokenSymbol = cosmosBalance.token.toUpperCase() + "USDT"
        cosmosBalance['usdBalance'] = Number(Number(priceFeeds[tokenSymbol] * cosmosBalance.balance).toFixed(2))
        cosmosBalance['currentTokenPrice'] = Number(Number(priceFeeds[tokenSymbol]).toFixed(2))
    })
    const totalBalance = cosmosBalances.reduce((total, balance) => total + balance.usdBalance, 0)
    return {cosmosBalances, totalBalance}
}


function getProtfolioTableRowsHTML(totalBalance) {
    return totalBalance.cosmosBalances.map(cosmosBalance => `
        <tr>
            <td>${cosmosBalance.token.toUpperCase()}</td>
            <td>${cosmosBalance.currentTokenPrice}</td>
            <td>${cosmosBalance.balance}</td>
            <td>${cosmosBalance.usdBalance}</td>
        </tr>
    `).join('')
}

function getProtfolioTotalBalanceRowHTML(totalBalance) {
    return `
    <tfoot>
        <tr>
            <td colspan="2">Balance in USD: </td>
            <td colspan="2" id="total-value">${totalBalance.totalBalance.toFixed(2)}</td>
        </tr>
    </tfoot>`
}