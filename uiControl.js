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

function updateAddressDropDown(addressDropdown, cosmosAddressesStorage) {
    addressDropdown.innerHTML = ""
    if(cosmosAddressesStorage.length > 0) {
        addressDropdown.innerHTML = cosmosAddressesStorage.map(address => `<option value="${address}">${address}</option>`).join('')
    } else {
        addressDropdown.innerHTML = "<option value=''>No addresses saved</option>"
    }
}

function updateModalAddressLists(addressList, cosmosAddressesStorage) {
    if (cosmosAddressesStorage.length > 0) {
        addressList.innerHTML = ""
        const cosmosAddressesHTML = cosmosAddressesStorage.map(cosmosAddress => 
            `
            <li>
                <p>${cosmosAddress}</p>
                <button class="delete-address" data-address="${cosmosAddress}">Delete</button>
            </li>`).join('')
        addressList.innerHTML = cosmosAddressesHTML
    } else {
        addressList.innerHTML = "<li>No addresses saved</li>"
    }
}

export { getProtfolioTableRowsHTML, getProtfolioTotalBalanceRowHTML, updateAddressDropDown, updateModalAddressLists}