//import ListGroup from "./components/ListGroup";
import ImageUploader from "./components/ImageUploader";
import './App.css'
import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers';

const App = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);


  const handleConnect = async () => {
    try {
      // detect if Metamask is installed and available
      const provider = await detectEthereumProvider();

      if (!provider) {
        console.error('Metamask not found');
        return;
      }

      // request permission to access user's accounts
      if ((provider as any).request && (provider as any).request({ method: 'eth_accounts' })) {
        await (provider as any).request({ method: 'eth_requestAccounts' });
      } else {
        // if the provider doesn't have a request method, fall back to the legacy API
        await (provider as any).enable();
      }

      // get the signer object for the currently connected account in Metamask
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const signer = ethersProvider.getSigner();
      setSigner(signer);

      // get the current account address from Metamask
      const accounts = await ethersProvider.listAccounts();
      setWallet(accounts[0]); // assuming there is at least one account connected
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div style={{ textAlign: "center" }}>
      <header
        style={{ margin: "32px auto", fontSize: "24px", fontWeight: "bold" }}
      >
        NFT Generator
      </header>
      <ImageUploader signer={signer} wallet={wallet} />
      {wallet ? (
          <p>Wallet address: {wallet}</p>
        ) : (
          window.ethereum?.isMetaMask && (
            <button onClick={handleConnect}>Connect MetaMask</button>
          )
        )}
      
    </div>
  );
}

export default App;