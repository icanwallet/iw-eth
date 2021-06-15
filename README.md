## iw-eth
>> This project provides a simple package to realize the core logic of the wallet. If you have any questions, please ask at the following website
[icanwallet](https://github.com/icanwallet/icanwallet)

## use case

### address

``` javascript
//from mnemonic
const ecc = require('iw-eth')
const wallet = ecc.fromMnemonic(mnemonic)
console.log(wallet)
//from privateKey
const wallet2 = ecc.fromPrivateKey(wallet.privateKey)
console.log(wallet2)
//check address
console.log(ecc.isAddress(wallet.address))

```


### account

``` javascript
//balance
const ecc = require('iw-eth')
const balance = await ecc.balanceOf('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
console.log(balance)
//contract balance
const balance2 = await ecc.balanceOf('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2','0x1f9840a85d5af5bf1d1762f925bdaddc4201f984')
console.log(balance2)

/**
 * transfer
 * 
 * @param {String} privateKey
 * @param {String} token  eg. 'eth' or 'token address'
 * @param {String} receiver
 * @param {Number} amount
 * @param {Object} op gasLimit gasPrice
 * @param {Number} decimal
 * @return {Object}
 */
let rt = await ecc.transfer(privateKey, token, receiver, amount, op, decimal = 18)
/**
 * logs
 * 
 * @param {String} address
 * @param {String} token eg. 'eth' or 'token address'
 * @param {Number} page
 * @param {Number} pagesize
 * @return {Object} or {Boolean}
 */
//eth logs
const logs = await ecc.logs('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 'eth', 1, 20)
console.log(logs)
//contract logs
const logs2 = await ecc.logs('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 1, 20)
console.log(logs2)
```