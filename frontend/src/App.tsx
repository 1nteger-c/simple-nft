//import ListGroup from "./components/ListGroup";
import ImageUploader from "./components/ImageUploader";
import "./App.css";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import logo from "../title.png";

const App = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      // detect if Metamask is installed and available
      const provider = await detectEthereumProvider();

      if (!provider) {
        console.error("Metamask not found");
        return;
      }

      // request permission to access user's accounts
      if (
        (provider as any).request &&
        (provider as any).request({ method: "eth_accounts" })
      ) {
        await (provider as any).request({ method: "eth_requestAccounts" });
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
      <img src={logo} alt="Logo" style={{ width: "50%" }} />
      <ImageUploader signer={signer} wallet={wallet} />
      {wallet ? (
        <p>Wallet address: {wallet}</p>
      ) : (
        window.ethereum?.isMetaMask && (
          <button onClick={handleConnect}>Connect MetaMask</button>
        )
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: "20px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <h2>Instructions:</h2>
          <p style={{ marginTop: "20px" }}>1. Connect your Metmask Wallet</p>
          <p>2. Select an image you want to mint using "select file" button</p>
          <p>3. Upload the image using "Upload" button</p>
          <p>
            4. Mint the uploaded image using "Mint!" button. Now, your NFT is in
            your wallet!
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
