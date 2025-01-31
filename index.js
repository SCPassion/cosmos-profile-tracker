// // javascript
// const url = "https://api-osmosis.imperator.co/tokens/v2/price/TIA";

// async function fetchPrice() {
//     try {
//         const response = await fetch(url)
//         if (!response.ok) throw new Error("Failed to fetch price")
        
//         // const data = await response.json()
            
//         // console.log(data)
//     } catch(error) {
//         console.error("Error fetching:", error)
//     }
// }

// fetchPrice()

// // setInterval(() => fetchPrice(), 1000)

const ws = new WebSocket("wss://stream.binance.com:9443/ws/tiausdt@trade");

// Listen for price updates
ws.onmessage = (event) => {
    const tradeData = JSON.parse(event.data);
    console.log(`1 TIA = $${tradeData.p} USD`);
};

// Close WebSocket after 10 seconds
setTimeout(() => {
    console.log("Closing WebSocket...");
    ws.close();
}, 10000); // Closes after 10 seconds