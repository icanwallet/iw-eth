const {
	Wallet
} = require('./wallet');
const {
	getAddress
} = require('./utils/address.js')
const account = require('./iw-account.js')
/**
 * 从助记词获取钱包
 */
const fromMnemonic = (mnemonic, path) => Wallet.fromMnemonic(mnemonic, path)
/**
 * 从私钥获取钱包
 */
const fromPrivateKey = privateKey => new Wallet(privateKey)
/**
 * 判断地址合法性
 */
const isAddress = address => {
	try {
		getAddress(address);
		return true;
	} catch (e) {
		return false;
	}
}

module.exports = {
	fromMnemonic,
	fromPrivateKey,
	isAddress,
	...account
}
