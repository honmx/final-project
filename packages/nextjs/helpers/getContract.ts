import { ethers } from "ethers";
import deployedContracts from "../contracts/deployedContracts";

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contractAddress = deployedContracts[31337].ElectionSystem.address;
  const contractABI = deployedContracts[31337].ElectionSystem.abi;

  return new ethers.Contract(contractAddress, contractABI, signer);
};