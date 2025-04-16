// ProtectedRoute.jsx
import { useEffect } from 'react';
// import { useRouter } from 'next/router'; // For Next.js
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

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
export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      navigate('/', { replace: true });
    }
  }, [isConnected, navigate]);

  return isConnected ? children : null;
};