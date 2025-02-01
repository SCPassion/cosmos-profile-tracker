import { fromBech32, toBech32 } from "https://cdn.jsdelivr.net/npm/@cosmjs/encoding/+esm";

// Address symbol for address reconstruction
const mapNetworkToSymbol = {
    celestia: "celestia",
    cosmoshub: "cosmos",
    osmosis: "osmo",
    juno: "juno"
}

// Address symbol for address reconstruction
const mapNetworkToTokenName = {
    celestia: "tia",
    cosmoshub: "atom",
    osmosis: "osmo",
    juno: "juno"
}

function convertAddress(address, prefix) {
    const { prefix: oldPrefix, data } = fromBech32(address);
    return toBech32(prefix, data);
}

async function fetchAllBalances(networkAddresses) {
    const balances = await Promise.all(networkAddresses.map(network => fetchBalance(network)))
    console.log(balances)
}

async function fetchBalance(cosmosNetwork) {
    const {networkName, tokenName, address} = cosmosNetwork
    const baseCosmosUrl = `https://rest.cosmos.directory/${networkName}/cosmos`

    try {
    const DataPromise = await Promise.all([
        fetch(`${baseCosmosUrl}/bank/v1beta1/balances/${address}`), 
        fetch(`${baseCosmosUrl}/staking/v1beta1/delegations/${address}`), 
        fetch(`${baseCosmosUrl}/distribution/v1beta1/delegators/${address}/rewards`)]
    )

    const [liquidData, stakingData, rewardData] = await Promise.all(DataPromise.map(response => response.json()))

    const liquidBalance = liquidData.balances.length > 0 ? Number(liquidData.balances.find(balances => balances.denom === "u" + tokenName).amount) / 1000000 : 0
    const stakingBalance = stakingData.delegation_responses.length > 0 ? Number(stakingData.delegation_responses[0].balance.amount) / 1000000 : 0
    const rewardBalance = rewardData.rewards.length > 0 ? Number(rewardData.rewards[0].reward[0].amount) / 1000000 : 0
    
    const totalBalance = ((liquidBalance + stakingBalance + rewardBalance)).toFixed(6)

    return {network: networkName, address: address, token: tokenName, balance: totalBalance}
    } catch (error) {
        console.error(`Error fetching balance for ${networkName}:`, error)
    }
}

export { mapNetworkToSymbol, mapNetworkToTokenName, convertAddress, fetchAllBalances}