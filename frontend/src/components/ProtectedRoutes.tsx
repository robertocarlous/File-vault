// ProtectedRoute.jsx
import { useEffect } from 'react';
// import { useRouter } from 'next/router'; // For Next.js
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { showToast } from '../utils/toast';

// Higher-order component to protect routes requiring wallet connection
// export const ProtectedRoute = ({ children }) => {
// //   const router = useRouter();
//   const { isConnected } = useAccount();

//   useEffect(() => {
//     // If not connected, redirect to connection page
//     if (!isConnected) {
//       router.push('/connect'); // Update this to your wallet connection page
//     }
//   }, [isConnected, router]);

//   // If connected, render the children (protected content)
//   return isConnected ? children : null;
// };

// For React Router (if not using Next.js)
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      showToast.warning('Please connect your wallet to access this page');
      navigate('/', { replace: true });
    }
  }, [isConnected, navigate]);

  return isConnected ? children : null;
};