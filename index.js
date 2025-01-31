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

const priceFetcher = setInterval(()=>fetchPrices(symbols), 2000)

setTimeout(()=> {
    clearInterval(priceFetcher)
    console.log("Stop fetching")
}, 20000)