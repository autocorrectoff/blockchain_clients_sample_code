(async () => {
	const { PrivateKey, Transaction } = require('bitcore-lib');
	const ecc = require('tiny-secp256k1');
	const bip39 = require('bip39');
	const { BIP32Factory } = require('bip32');
	const { readFileSync } = require('fs');

	const addressFromWIF = (wif) => {
		return PrivateKey.fromWIF(wif).toAddress().toString();
	};

	const generateKeyPairFromMnemonic = (mnemonic, accountBIP) => {
		const seed = bip39.mnemonicToSeedSync(mnemonic);
		const bip32 = BIP32Factory(ecc);
		const node = bip32.fromSeed(seed);
		const child = node.derivePath(accountBIP);
		const publicKey = PrivateKey.fromWIF(node.toWIF()).toAddress().toString();
		return { publicKey, wif: child.toWIF() };
	};

	const createTx = (fromWIF, toAddress, satoshiAmount) => {
		const privateKey = PrivateKey.fromWIF(fromWIF);
		const utxo = {
			txId: '115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986',
			outputIndex: 0,
			address: privateKey.toAddress().toString(),
			script: '76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac',
			satoshis: 50000
		};

		return new Transaction().from(utxo).to(toAddress, satoshiAmount).sign(privateKey);
	};

	const mnemonic = readFileSync('./mnemonic.txt', {
		encoding: 'utf-8'
	});
	// Getting first address from HD Wallet
	const account1BIP = "m/44'/0'/0'/0/0";
	const keyPair1 = generateKeyPairFromMnemonic(mnemonic, account1BIP);

	// Getting second address from HD Wallet
	const account2BIP = "m/44'/0'/0'/0/1";
	const keyPair2 = generateKeyPairFromMnemonic(mnemonic, account2BIP);

	/**
	 * Making a transaction from address 1 to address 2.
	 * This will only create a transaction it will not broadcast it to blockchain for mining
	 * No broadcast support in bitcore-lib
	 */
	const tx = createTx(keyPair1.wif, keyPair2.publicKey, 15000);
	console.log(tx);
})();
