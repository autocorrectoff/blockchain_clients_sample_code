(async () => {
	const {
		Keypair,
		Transaction,
		SystemProgram,
		LAMPORTS_PER_SOL,
		sendAndConfirmTransaction,
		clusterApiUrl,
		Connection
	} = require('@solana/web3.js');
	const { readFileSync } = require('fs');
	const bs58 = require('bs58');
	const ed25519 = require('ed25519-hd-key');
	const bip39 = require('bip39');

	const generateRandomKeyPair = () => {
		const keypair = Keypair.generate();
		const privateKey = bs58.encode(keypair.secretKey);
		return { publicKey: keypair.publicKey.toString(), privateKey };
	};

	const keyPairFromMnemonic = async (mnemonic, accountBIP) => {
		const seed = await bip39.mnemonicToSeed(mnemonic);
		const derivedSeed = ed25519.derivePath(accountBIP, seed.toString('hex')).key;
		return Keypair.fromSeed(derivedSeed);
	};

	const printEncodedKeysFromPrivateKey = (privateKey) => {
		const privateKeyArr = bs58.decode(privateKey);
		const keypair = Keypair.fromSecretKey(privateKeyArr, { skipValidation: false });
		return { publicKey: keypair.publicKey.toString(), privateKey };
	};

	const keyPairFromPrivateKey = (privateKey) => {
		const privateKeyArr = bs58.decode(privateKey);
		return Keypair.fromSecretKey(privateKeyArr, { skipValidation: false });
	};

	const performTransaction = async (from, to, sol, network) => {
		const tx = new Transaction();
		tx.add(
			SystemProgram.transfer({
				fromPubkey: from.publicKey,
				toPubkey: to.publicKey,
				lamports: LAMPORTS_PER_SOL * sol
			})
		);
		const connection = new Connection(clusterApiUrl(network), 'confirmed');
		const txResult = await sendAndConfirmTransaction(connection, tx, [from]);
		return txResult;
	};

	// Generating a keypair
	console.log(generateRandomKeyPair());

	// Keypair from private key
	console.log(keyPairFromPrivateKey('private key here'));

	const mnemonic = readFileSync('./mnemonic.txt', {
		encoding: 'utf-8'
	});

	// Getting first address from HD Wallet
	const account1BIP = "m/44'/501'/0'/0'";
	const keyPair1 = await keyPairFromMnemonic(mnemonic, account1BIP);
	console.log(keyPair1.publicKey.toString());

	// Getting second address from HD Wallet
	const account2BIP = "m/44'/501'/0'/1'";
	const keyPair2 = await keyPairFromMnemonic(mnemonic, account2BIP);
	console.log(keyPair2.publicKey.toString());

	// Making a transaction
	await performTransaction(keyPair2, keyPair1, 0.5, 'testnet');
})();
