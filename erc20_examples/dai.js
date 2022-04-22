// https://github.com/makerdao/developerguides/blob/master/dai/dai-token/dai-token.md 

const { ethers, Contract, utils } = require('ethers');
const { readFileSync } = require('fs');

const DAIRinkebyAddr = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa';

const daiAbi = [
	'function symbol() public view returns (string)',
	'function name() public view returns (string)',
	'function decimals() public view returns (uint8)',
	'function totalSupply() public view returns (uint)',
	'function balanceOf(address usr) public view returns (uint)',
	'function transfer(address dst, uint wad) returns (bool)'
];

const walletFromMnemonic = (mnemonic, accountBIP) => {
	return ethers.Wallet.fromMnemonic(mnemonic, accountBIP);
};

const getFirstTwoWallets = () => {
	const mnemonic = readFileSync('./mnemonic.txt', {
		encoding: 'utf-8'
	});

	const account1BIP = "m/44'/60'/0'/0/0";
	const wallet1 = walletFromMnemonic(mnemonic, account1BIP);

	const account2BIP = "m/44'/60'/0'/0/1";
	const wallet2 = walletFromMnemonic(mnemonic, account2BIP);

	return [wallet1, wallet2];
};

const getSymbol = async (contract) => {
	return await contract.symbol();
};

const getName = async (contract) => {
	return await contract.name();
};

const getDecimals = async (contract) => {
	return await contract.decimals();
};

const getTotalSupply = async (contract) => {
	return (await contract.totalSupply()).toString();
};

const getBallance = async (address, contract) => {
	const balance = await contract.balanceOf(address);
	return Number(balance.toString()) / 1e18;
};

const transfer = async (to, amount, contract) => {
	const tx = await contract.transfer(to, amount);
	await tx.wait(1);
};

const main = async () => {
	const wallets = getFirstTwoWallets();
	const provider = new ethers.providers.JsonRpcProvider('your rinkeby provider');
	const signer = wallets[0].connect(provider);

	const daiContract = new Contract(DAIRinkebyAddr, daiAbi, signer);

	// Getting symbol
	const symbol = await getSymbol(daiContract);
	console.log(symbol);

	// Getting name
	const name = await getName(daiContract);
	console.log(name);

	// Getting name
	const decimals = await getDecimals(daiContract);
	console.log(decimals);

	// Getting total supply of DAI
	const total = await getTotalSupply(daiContract);
	console.log(total);

	// Getting balance
	const balance = await getBallance(wallets[0].address, daiContract);
	console.log(balance);

	// Transfer 1 DAI
	const dai = utils.parseUnits('1.0', 18);
	await transfer(wallets[1].address, dai, daiContract);
};

main()
	.then()
	.catch((err) => console.log(err));
