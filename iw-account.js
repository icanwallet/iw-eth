const {
	Wallet
} = require('./wallet');

const JsonRpcProvider = require('./providers/json-rpc-provider.js')
const Contract = require('./contracts/contract.js')
const utils = require('./utils');
const defalutAbi = require('./iw-abi.json');
const iwax = require('iwax')
export const GASLIMIT = 150000
/**
 * 配置信息
 */
export let config = require('./iw-config.js')
/**
 * 默认节点
 */
config.nodeUrl = config.node.find(el => el.isdef == 1).url
/**
 * 获取代币的名称和decimal
 * 
 * @param {String} token
 * @return {Object} or {Boolean}
 */
export const tokenInfo = async (token) => {
	let [err, res] = await iwax({
		url : `https://api.blockchair.com/ethereum/erc-20/tokens?q=address(${token})`
	});
	if (res && res.data && res.data.data && res.data.data.length > 0) {
		return res.data.data[0];
	}
	return false;
}
/**
 * 获取gas详情
 * @return {Object} or {Boolean}
 */
export const getGas = async () => {
	let [err, res] = await iwax({
		url: 'https://ethgasstation.info/json/ethgasAPI.json'
	});
	//console.log(res)
	if (res && res.data) {
		let ethgas = res.data;
		return {
			wait: {
				low: ethgas.safeLowWait,
				avg: ethgas.avgWait,
				fast: ethgas.fastestWait
			},
			eth: {
				low: ethgas.safeLow,
				avg: ethgas.average,
				fast: ethgas.fastest
			}
		}
	}
	return false;
}
/**
 * 获取abi
 * @param {String} token
 *  @return {Object} or {Boolean}
 */
export const getAbi = async (token) => {
	let url = `${config.etherscan.url}?module=contract&action=getabi&address=${token}&apikey=${config.etherscan.key}`;
	let [err, res] = await iwax({
		url
	});
	if (res && res.data && res.data.status > 0) {
		return res.data.result;
	}
	return false;
}
/**
 * 获取合约对象
 * @param {String} privateKey
 * @param {String} token
 * @param {Object} abi
 * @return {Object}
 */
export const getCantract = (privateKey, token, abi) => {
	const provider = new JsonRpcProvider(config.nodeUrl);
	const wallet = new Wallet(privateKey, provider);
	return new Contract(token, abi, wallet);
}
/**
 * 位符转换
 */
export const fixNumber = (num, decimal) => Number(num / Math.pow(10, decimal)).toFixed(3) * 1
/**
 * 获取eth或代币的余额
 * 
 * @param {String} address
 * @param {String} token
 * @param {Number} decimal
 * @return {Object} or {Boolean}
 */
export const balanceOf = async (address, token = 'eth', decimal = 18) => {
	const provider = new JsonRpcProvider(config.nodeUrl);
	let balance = 0;
	if (token == 'eth') {
		balance = await provider.getBalance(address);
	} else {

		const contracts = new Contract(token, defalutAbi, provider);
		balance = await contracts.balanceOf(address);
	}
	return fixNumber(balance, decimal);
}
/**
 * 查账另外一个方式
 * 
 * @param {String} token
 * @param {String} address
 * @param {Number} decimal
 * @return {Object} or {Boolean}
 */
export const balanceOfEtherscan = async (address, token = 'eth', decimal = 18) => {
	let url;
	if (token == 'eth') {
		url = `${config.etherscan.url}?module=account&action=balance&address=${address}&tag=latest&apikey=${config.etherscan.key}`;
	} else {
		url = `${config.etherscan.url}?module=account&action=tokenbalance&contractaddress=${token}&address=${address}&tag=latest&apikey=${config.etherscan.key}`;
	}

	let [err, res] = await iwax({url});
	
	if (res && res.data && res.data.status > 0) {
		return fixNumber(res.data.result, decimal)
	} else {
		return 0;
	}
}
/**
 * 转账
 * 
 * @param {String} privateKey
 * @param {String} token  eg. 'eth' or 'token address'
 * @param {String} receiver
 * @param {Number} amount
 * @param {Object} op
 * @param {Number} decimal
 * @return {Object}
 */
export const transfer = async (privateKey, token, receiver, amount, op, decimal = 18) => {
	const provider = new JsonRpcProvider(config.nodeUrl);
	const wallet = new Wallet(privateKey, provider);

	op.gasLimit = op.gasLimit ? op.gasLimit * 1 : GASLIMIT;
	op.gasPrice = op.gasPrice ? utils.bigNumberify(op.gasPrice) : await provider.getGasPrice();

	if (token == 'eth') {
		amount = utils.parseEther(amount.toString());
		let tx = {
			gasLimit: op.gasLimit,
			to: receiver,
			value: amount,
			gasPrice: op.gasPrice
		}
		let rt = await wallet.sendTransaction(tx);
	} else {
		amount = utils.parseUnits(Number(amount).toString(), decimal);
		let contracts = new Contract(token, defalutAbi, wallet);
		let rt = await contracts.transfer(receiver, amount, op);
	}

	return rt;
}
/**
 * 交易记录
 * 
 * @param {String} address
 * @param {String} token
 * @param {Number} page
 * @param {Number} pagesize
 * @return {Object} or {Boolean}
 */
export const logs = async (address, token = 'eth', page = 1, pagesize = 20) => {
	let url;
	page = page < 1 ? 1 : page;
	if (token == 'eth') {
		url = `${config.etherscan.url}?module=account&action=txlist&address=${address}&startblock=0&endblock=999999999&page=${page}&offset=${pagesize}&sort=desc&apikey=${config.etherscan.key}`;
	} else {
		//erc20
		url = `${config.etherscan.url}?module=account&action=tokentx&contractaddress=${token}&address=${address}&page=${page}&offset=${pagesize}&sort=desc&apikey=${config.etherscan.key}`;
		//erc721
		//url = `${ethscanUrl}?module=account&action=tokennfttx&contractaddress=${token}&address=${address}&page=${page}&offset=${pagesize}&sort=desc&apikey=${ethscanKey}`;
	}
	//console.log(url)
	let [error, rtdata] = await iwax({
		url
	})
	if (!rtdata || !rtdata.data || !rtdata.data.result || rtdata.data.result.length < 1) return false
	let rs = rtdata.data.result
	//console.log(rs);
	rs.forEach(ps => {
		ps['transferType'] = (ps['from'].toLowerCase() == address.toLowerCase()) ? 'out' : 'in'
		ps['token'] = token
		ps['address'] = address
		ps['value'] = fixNumber(ps['value'], ps['tokenDecimal'] ? ps['tokenDecimal'] : 18)
		ps['time'] = ps['timeStamp']
	})
	return rs

}

