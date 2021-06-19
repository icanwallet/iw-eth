## iw-eth
>> This project provides a simple package to realize the core logic of the wallet. If you have any questions, please ask at the following website
[icanwallet](https://github.com/icanwallet/icanwallet)

## use case

``` javascript
//install
npm i iw-eth -s

```

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

### contract

``` javascript
const ecc = require('iw-eth')
const privateKey = '0x27388b508812e27e1bf3e550d4b94c6bf2659e3978c5639702ff24d96daed800'
/**
 * 发布一个简单的erc20合约（usdt）
 * @param {String} privateKey
 * @param {Number} total_supply 总发布多少
 * @param {String} name 代币名字
 * @param {String} symbol 代币符号
 * @param {Number} decimals 代币的位数
 * 
 */
let rt = await libs.deployContract(privateKey)
console.log(rt)
let  balance = await libs.balanceOf('0xA43b5A70B16d519d3d75E264446De5a29e8f14FA')
console.log(balance)
let rt1 = await libs.transfer(privateKey, 'eth', '0xA43b5A70B16d519d3d75E264446De5a29e8f14FA', 0.01)
//console.log(rt) 0xd9818fa453F875c2C670B51F1266297419f4051d
let balance2 = await libs.balanceOf('0x5219aeed873ca870a437cb7e9a8959855fb8544f', '0x84f08044f93ada1af6542735bb0cd7bb5278e930',6)
// console.log(balance);

let rt2 = await libs.transfer(privateKey, '0x84f08044f93ada1af6542735bb0cd7bb5278e930', '0xA43b5A70B16d519d3d75E264446De5a29e8f14FA', 0.01, 6)
console.log(rt2)
```