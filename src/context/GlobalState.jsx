import { createContext, useContext, useEffect, useState } from "react";
import RoboPunksNFT from '../components/RoboPunksNFT.json'
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Authereum from "authereum";
// import MewConnect from "@myetherwallet/mewconnect-web-client";
import { ethers, BigNumber } from 'ethers';
import Web3Modal from "web3modal";

const { ethereum } = window;
const CONTRACT_ADDRESS = "0x2676037Fe2f9158D1C9bbA67D1CD28d33202a29B"
const CONTRACT_ABI = RoboPunksNFT.abi;

export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
    const [web3Modal, setWeb3Modal] = useState(null)
    const [balance, setBalance] = useState();
    const [currentAccount, setCurrentAccount] = useState("");
    const [mintAmount, setMintAmount] = useState(1)
    // const isConnected = Boolean(accounts[0]);

    const providerOptions = {
        /* See Provider Options Section */
        coinbasewallet: {
            package: CoinbaseWalletSDK, // Required
            options: {
                appName: "Desi Kukar", // Required
                infuraId: "17342b0f3f344d2d96c2c89c5fddc959", // Required
                rpc: "", // Optional if `infuraId` is provided; otherwise it's required
                chainId: 4, // Optional. It defaults to 1 if not provided
                darkMode: false // Optional. Use dark theme, defaults to false
            }
        },

        walletconnect: {
            display: {
                name: "Mobile"
            },
            package: WalletConnectProvider,
            options: {
                infuraId: "17342b0f3f344d2d96c2c89c5fddc959" // required
            }
        },
        authereum: {
            package: Authereum // required
        },
        // mewconnect: {
        //     package: MewConnect, // required
        //     options: {
        //         infuraId: "17342b0f3f344d2d96c2c89c5fddc959" // required
        //     }
        // }
    };


    const getModalConnect = async () => {
        const web3Modal = new Web3Modal({
            network: "rinkeby",
            cacheProvider: true, // very important
            providerOptions,
        });
        await web3Modal.connect();
        console.log("Web3Modal : ", web3Modal)
        setWeb3Modal(web3Modal)
    }

    const getContract = async () => {
        const provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethersProvider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        console.log(contract)
        return contract
    };

    // disconnect wallet
    const disconnectWallet = async () => {
        await web3Modal.clearCachedProvider()
    }

    const getBalance = async () => {
        const provider = await web3Modal.connect();
        const ethersProvider = new ethers.providers.Web3Provider(provider)
        const signer = ethersProvider.getSigner();
        // const acc = await signer.getAddress()
        // const [account] = await ethereum.request({ method: 'eth_requestAccounts' })
        // setCurrentAccount(acc);
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accountBalance = await signer.getBalance(currentAccount);
        setBalance(ethers.utils.formatEther(accountBalance));
        // return accountBalance
    };

    const mintToken = async () => {
        try {
            const contract = await getContract();
            const response = await contract.mint(BigNumber.from(mintAmount), {
                value: ethers.utils.parseEther((0.02 * mintAmount).toString())
            })
            // const response = await contract.mintNFTs(1, {
            //     value: ethers.utils.parseEther('0.01')
            // });
            await response.wait();
            // getMintedStatus();
            // getCount();
        } catch (error) {
            console.log("error: ", error)
        }

    }



    useEffect(() => {
        const modalRun = async () => {
            if (web3Modal) {
                const provider = await web3Modal.connect();
                const ethersProvider = new ethers.providers.Web3Provider(provider)
                const signer = ethersProvider.getSigner();
                const acc = await signer.getAddress()
                setCurrentAccount(acc);
            }
        }
        modalRun();
    }, [web3Modal]);

    return (
        <GlobalContext.Provider value={{
            mintToken, setMintAmount, mintAmount, currentAccount, getModalConnect, disconnectWallet, setCurrentAccount
        }} >
            {children}
        </GlobalContext.Provider>
    )
}

export const GlobalStore = () => useContext(GlobalContext);