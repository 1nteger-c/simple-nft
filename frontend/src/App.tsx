//import ListGroup from "./components/ListGroup";
import ImageUploader from "./components/ImageUploader";
import './App.css'
import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

const App = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const initialState = { accounts: [] }
  const [wallet, setWallet] = useState(initialState)

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {                /* New */
      if (accounts.length > 0) {                                /* New */
        updateWallet(accounts)                                  /* New */
      } else {                                                  /* New */
        // if length 0, user is disconnected                    /* New */
        setWallet(initialState)                                 /* New */
      }                                                         /* New */
    }                                                           /* New */

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))

      if (provider) {                                           /* New */
        const accounts = await window.ethereum.request(         /* New */
          { method: 'eth_accounts' }                            /* New */
        )                                                       /* New */
        refreshAccounts(accounts)                               /* New */
        window.ethereum.on('accountsChanged', refreshAccounts)  /* New */
      }                                                         /* New */
    }

    getProvider()
    return () => {                                              /* New */
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
    }                                                           /* New */
  }, [])

  const updateWallet = async (accounts:any) => {
    setWallet({ accounts })
  }

  const handleConnect = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    updateWallet(accounts)
  }  

  return (
    <div style={{ textAlign: "center" }}>
      <header
        style={{ margin: "32px auto", fontSize: "24px", fontWeight: "bold" }}
      >
        NFT Generator
      </header>
      <ImageUploader />
      <div> {hasProvider} Exist</div>
      
      { window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&  /* Updated */
        <button onClick={handleConnect}>Connect MetaMask</button>
      }
      { wallet.accounts.length > 0 &&                /* New */
        <div>Wallet Accounts: { wallet.accounts[0] }</div>
      }
    </div>
  );
}

export default App;
