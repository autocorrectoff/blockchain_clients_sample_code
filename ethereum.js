const { ethers } = require('ethers');
const { readFileSync } = require('fs');

(async () => {
	const generateRandomHDWallet = () => {
		const wallet = ethers.Wallet.createRandom();
		return {
			address: wallet.address,
			mnemonic: wallet.mnemonic.phrase,
			privateKey: wallet.privateKey
		};
	};

	const walletFromMnemonic = (mnemonic, accountBIP) => {
		return ethers.Wallet.fromMnemonic(mnemonic, accountBIP);
	};

	const makeTransaction = async (wallet1, wallet2, ethAmmount) => {
		const provider = new ethers.providers.JsonRpcProvider('your_provider_url_here');
		const signer = wallet1.connect(provider);

		const tx = await signer.sendTransaction({
			to: wallet2.address,
			value: ethers.utils.parseEther(ethAmmount)
		});

		await tx.wait(1);
	};

	// Generating a new wallet
	const walletInfo = generateRandomHDWallet();
	console.log(walletInfo);

	const mnemonic = readFileSync('./mnemonic.txt', {
		encoding: 'utf-8'
	});

	// Getting first address from HD Wallet
	const account1BIP = "m/44'/60'/0'/0/0";
	const wallet1 = walletFromMnemonic(mnemonic, account1BIP);

	// Getting second address from HD Wallet
	const account2BIP = "m/44'/60'/0'/0/1";
	const wallet2 = walletFromMnemonic(mnemonic, account2BIP);

	// Send 1 eth from wallet1 to wallet2
	await makeTransaction(wallet1, wallet2, '1.0');
})();
