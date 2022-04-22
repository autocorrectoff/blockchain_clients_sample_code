(async () => {
	const bitcoin = require('bitcoinjs-lib');
	const { ECPairFactory } = require('ecpair');
	const ecc = require('tiny-secp256k1');
	const bip39 = require('bip39');
	const { BIP32Factory } = require('bip32');
	const { readFileSync } = require('fs');

	const TESTNET = bitcoin.networks.testnet;

	const generateRandomKeyPair = (network) => {
		const ECPair = ECPairFactory(ecc);
		return ECPair.makeRandom({ network });
	};

	const getAddress = (node, network) => {
		return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address;
	};

	const WifToECPair = (wif) => {
		const ECPair = ECPairFactory(ecc);
		return ECPair.fromWIF(wif);
	};

	const generateKeyPairFromMnemonic = (mnemonic, accountBIP, network) => {
		const seed = bip39.mnemonicToSeedSync(mnemonic);
		const bip32 = BIP32Factory(ecc);
		const node = bip32.fromSeed(seed);
		const child = node.derivePath(accountBIP);
		const publicKey = getAddress(child, network);
		return { publicKey, wif: node.toWIF() };
	};

	const mnemonic = readFileSync('./mnemonic.txt', {
		encoding: 'utf-8'
	});

	// Getting first address from HD Wallet
	const account1BIP = "m/44'/0'/0'/0/0";
	const keys = generateKeyPairFromMnemonic(mnemonic, account1BIP, TESTNET);
	console.log(keys);
})();
