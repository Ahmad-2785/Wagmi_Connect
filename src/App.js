import Main from "./pages/main";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, goerli, polygonMumbai } from "@wagmi/core/chains";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";

import { ColorModeScript } from "@chakra-ui/react";
import log from "simple-git/dist/src/lib/tasks/log";

function App() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, goerli, polygonMumbai],
    [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id == mainnet.id) {
            return {
              http: "https://eth-mainnet.g.alchemy.com/v2/AJQ3xAToNbhrRgr-JKAnZzYYT0-KrC8P",
              webSocket:
                "wss://eth-mainnet.g.alchemy.com/v2/AJQ3xAToNbhrRgr-JKAnZzYYT0-KrC8P",
            };
          } else if (chain.id == goerli.id) {
            return {
              http: "https://eth-goerli.g.alchemy.com/v2/ZCKGMAa8VUVlwSU3XhlREkPDWIDyAvbQ",
              webSocket:
                "wss://eth-goerli.g.alchemy.com/v2/ZCKGMAa8VUVlwSU3XhlREkPDWIDyAvbQ",
            };
          } else if (chain.id == polygonMumbai.id) {
            return {
              http: "https://polygon-mumbai.g.alchemy.com/v2/Ns5fI1hfcy06usLf4LUEq-r7zyOz8mXv",
              webSocket:
                "wss://polygon-mumbai.g.alchemy.com/v2/Ns5fI1hfcy06usLf4LUEq-r7zyOz8mXv",
            };
          }
        },
      }),
    ]
  );

  console.log("there are several technical skill abouts it");
  console.log("YOLO");
  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      // new CoinbaseWalletConnector({
      //   chains,
      //   options: {
      //     appName: 'wagmi',
      //   },
      // }),
      // new WalletConnectConnector({
      //   chains,
      //   options: {
      //     projectId: '...',
      //   },
      // }),
      // new InjectedConnector({
      //   chains,
      //   options: {
      //     name: 'Injected',
      //     shimDisconnect: true,
      //   },
      // }),
    ],
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={config}>
      <Main />
    </WagmiConfig>
  );
}

export default App;
