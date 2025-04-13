import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, filecoin, filecoinCalibration, mainnet, optimism, polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'File Vault',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base, filecoinCalibration, filecoin],
  ssr: true,
});
