import { Button } from "@/components/ui/button";
import { WalletIcon, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";

export function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const SUPPORTED_CHAINS = ['0x539', '0xaa36a7']; // Ganache and Sepolia

  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkConnection);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkConnection);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to wallet");
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(chainId);
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isUnsupportedChain = chainId && !SUPPORTED_CHAINS.includes(chainId);

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isUnsupportedChain && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please switch to Ganache or Sepolia network
          </AlertDescription>
        </Alert>
      )}

      {!account ? (
        <Button onClick={connectWallet} className="gap-2">
          <WalletIcon className="h-5 w-5" />
          Connect Wallet
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={disconnectWallet}
          className="gap-2"
        >
          <WalletIcon className="h-5 w-5" />
          {truncateAddress(account)}
        </Button>
      )}
    </div>
  );
}