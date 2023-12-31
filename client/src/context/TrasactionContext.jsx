import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const transactionContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = () => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();
	const transactionContract = new ethers.Contract(
		contractAddress,
		contractABI,
		signer
	);

	return transactionContract;
};

export const TransactoinProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState();
	const [isLoading, setIsLoading] = useState();
	const [transactionCount, setTransactionCount] = useState(
		localStorage.getItem("transactionCount")
	);
	const [formData, setFormData] = useState({
		addressTo: "",
		amount: "",
		keyword: "",
		message: "",
	});

	const handleChange = (e, name) => {
		setFormData((prevFromData) => ({
			...prevFromData,
			[name]: e.target.value,
		}));
	};

	const isWalletConnected = async () => {
		try {
			if (!ethereum) return alert("Please install metamask");

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				console.log("no accounts found.");
			}
		} catch (err) {
			console.error(err);
		}
	};

	const connectWallet = async () => {
		try {
			if (!ethereum) return alert("Please install metamask");
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			setCurrentAccount(accounts[0]);
		} catch (err) {
			console.error(err);
		}
	};

	const sendTransaction = async () => {
		try {
			if (!ethereum) return alert("Please install metamask.");

			const { addressTo, amount, keyword, message } = formData;
			const transactionContract = getEthereumContract();
			const parsedAmount = ethers.utils.parseEther(amount);

			await ethereum.request({
				method: "eth_sendTransaction",
				params: [
					{
						from: currentAccount,
						to: addressTo,
						gas: "0x5208", // 21000 GWEI
						value: parsedAmount._hex,
					},
				],
			});

			const transactionHash = await transactionContract.addToBlockchain(
				addressTo,
				parsedAmount,
				message,
				keyword
			);

			setIsLoading(true);
			console.log(`Loading: ${transactionHash.hash}`);

			await transactionHash.wait();

			setIsLoading(false);
			console.log(`Succes: ${transactionHash.hash}`);

			const transactionCount = await transactionContract.getTransactionCount();
			setTransactionCount(transactionCount.toNumber());
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		isWalletConnected();
	}, []);

	return (
		<transactionContext.Provider
			value={{
				connectWallet,
				currentAccount,
				formData,
				handleChange,
				sendTransaction,
				isLoading,
			}}
		>
			{children}
		</transactionContext.Provider>
	);
};
