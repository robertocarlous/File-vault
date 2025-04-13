import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { siwe } from 'siwe'; // Install this: npm install siwe

interface AuthContextType {
  isAuthenticated: boolean;
  address: string | undefined;
  connectAndSign: () => void;
  disconnectWallet: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect, isLoading: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedMessage, setSignedMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('authState');
    if (storedAuth) {
      const { address: storedAddress, signature } = JSON.parse(storedAuth);
      if (storedAddress === address && signature) {
        setSignedMessage(signature);
      }
    }
    setLoading(false);
  }, [address]);

  const connectAndSign = async () => {
    try {
      // First, connect the wallet
      await connect();

      if (!address) throw new Error('No wallet address found');

      // Generate a SIWE message
      const message = new siwe.SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in to File Vault to access your files.',
        uri: window.location.origin,
        version: '1',
        chainId: 1, // Ethereum mainnet, adjust based on your chain
        nonce: Math.random().toString(36).substring(2),
      });

      // Sign the message
      const signature = await signMessageAsync({ message: message.prepareMessage() });

      // Store the signature and address
      setSignedMessage(signature);
      localStorage.setItem('authState', JSON.stringify({ address, signature }));

      setError(null);
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
      console.error('Authentication error:', err);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setSignedMessage(null);
    localStorage.removeItem('authState');
    setError(null);
  };

  const isAuthenticated = !!isConnected && !!signedMessage;

  const value = {
    isAuthenticated,
    address,
    connectAndSign,
    disconnectWallet,
    loading: isConnecting || loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};