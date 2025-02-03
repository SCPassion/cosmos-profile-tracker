import { mapNetworkToSymbol, mapNetworkToTokenName, convertAddress, fetchAllBalances } from "./cosmosUtilities.js"
import { fetchPrices } from "./fetchBinancePriceFeed.js"
import { getProtfolioTableRowsHTML, getProtfolioTotalBalanceRowHTML, updateAddressDropDown } from "./uiControl.js"

const saveAddressEl = document.getElementById('save-address')
const selectAddressEl = document.getElementById('select-address')
const addressDropdown = document.getElementById('address-dropdown')
const totalBalanceEl = document.getElementById('total-balance')

const cosmosAddressInputEl = document.getElementById('cosmos-address')
const portfolioEl = document.getElementById('portfolio')
const portfolioBodyEl = document.getElementById('portfolio-body')
const portfolioFooterEl = document.getElementById('portfolio-footer')

const symbols = ["TIAUSDT", "OSMOUSDT", "ATOMUSDT", "SAGAUSDT"]
const selectedNetworks = ["celestia", "cosmoshub", "osmosis", "saga"]
let cosmosAddressesStorage = JSON.parse(localStorage.getItem('cosmosAddresses')) || []
console.log(cosmosAddressesStorage)

updateAddressDropDown(addressDropdown, cosmosAddressesStorage)

// How to fetch prices every 2 seconds continuously?
// const priceFetcher = setInterval(async ()=>console.log(await fetchPrices(symbols)), 2000)
// setTimeout(()=> {
//     clearInterval(priceFetcher)
//     console.log("Stop fetching")
// }, 20000)

// const anyCosmosAddress = "celestia1d3zcy6zm69m23mewaw0ja96pjll8a2vflzz598"

// cosmos addresses

saveAddressEl.addEventListener('submit', async (e) => {
    e.preventDefault()

    const cosmosAddress = cosmosAddressInputEl.value
    cosmosAddressInputEl.value = ""
    
    if(!cosmosAddressesStorage.includes(cosmosAddress)) {
        cosmosAddressesStorage.push(cosmosAddress)
        localStorage.setItem('cosmosAddresses', JSON.stringify(cosmosAddressesStorage))
        updateAddressDropDown(addressDropdown, cosmosAddressesStorage)
    }

});

selectAddressEl.addEventListener('submit', async (e) => {
    e.preventDefault()

    const cosmosAddress = addressDropdown.value
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

function clearLocalStorage() {
    localStorage.removeItem("cosmosAddresses");
}

async function getBalanceAcrossAllCosmosAddressess() {

    if(cosmosAddressesStorage.length > 0) {
        const totalBalances = await Promise.all(cosmosAddressesStorage.map(async (cosmosAddress) => {
            const networkAddresses = getNetworkAddresses(cosmosAddress, selectedNetworks)
            return (fetchBalances(networkAddresses))
        }))
        console.log(totalBalances)
        totalBalanceEl.textContent = `$ ${totalBalances.reduce((total, balance)=> total + balance.totalBalance, 0).toFixed(2)}`
    } else {
        totalBalanceEl.textContent = "$0.00"
    }
}

getBalanceAcrossAllCosmosAddressess()