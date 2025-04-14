import { BrowserProvider, Contract } from 'ethers';
import factoryABI from "../abis/VotingFactory.json";
import electionABI from "../abis/Election.json";

const FACTORY_ADDRESS = import.meta.env.VITE_DEPLOYED_CONTRACT_ADDRESS;

export const getProvider = () => {
    if (!window.ethereum) throw new Error("MetaMask is not installed");
    return new BrowserProvider(window.ethereum);
  };
  
  export const getSigner = async () => {
    const provider = getProvider();
    await provider.send('eth_requestAccounts', []);
    return provider.getSigner();
  };
  
  export const getFactoryContract = async () => {
    const signer = await getSigner();
    return new Contract(FACTORY_ADDRESS, factoryABI.abi, signer);
  };
  
  export const getElectionContract = async (address: string) => {
    const signer = await getSigner();
    return new Contract(address, electionABI.abi, signer);
  };
  
