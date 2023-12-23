import React, { useState } from "react";
import {
  useConnect,
  useContractEvent,
  useDisconnect,
  useEnsName,
  useAccount,
} from "wagmi";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";

import { goerli } from "@wagmi/core/chains";
import { Button } from "@chakra-ui/react";
import { getPublicClient } from "wagmi/actions";
import contractAbi from "./contractAbi.json";
import { createPublicClient, http, custom } from "viem";
import { FaTwitter, FaTelegram, FaWallet } from "react-icons/fa";

import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";

function Main() {
  const [inputAddress, setInputAddress] = useState("");
  const [nfts, setNFTs] = useState([]);
  const [myAddress, setMyAddress] = useState("");
  const [activeDisconnect, setActiveDisconnect] = useState(false);
  const { disconnect } = useDisconnect();

  function ConnectPublicClient() {
    // Check for window.ethereum
    let transport;
    if (window.ethereum) {
      transport = custom(window.ethereum);
    } else {
      const errorMessage =
        "MetaMask or another web3 wallet is not installed. Please install one to proceed.";
      throw new Error(errorMessage);
    }

    // Delcare a Public Client
    const publicClient = createPublicClient({
      chain: goerli,
      transport: transport,
    });
    return publicClient;
  }
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new MetaMaskConnector({
      chains: [goerli],
    }),
    chainId: goerli.id,
  });

  const connectWallet = async () => {
    await connect();

    console.log(address); // Prints the connected metamask account address
  };

  const fetchNFTs = async () => {
    const { readContract } = getPublicClient({ chainId: 5 });
    const resData = await readContract({
      address: "0xcC462Cae21b522b34acb02F3B7D0f4DC7B66933d",
      abi: contractAbi,
      functionName: "balanceOf",
      args: ["0xD6e842B844a67151D9319CFED96B39EEeC6D466f"],
    });
    console.log("resdata-----", resData);
    let publicClient = ConnectPublicClient();
    console.log("publicClient", await publicClient.getBlockNumber());
    const filter = await publicClient.createContractEventFilter({
      address: "0xcC462Cae21b522b34acb02F3B7D0f4DC7B66933d",
      abi: contractAbi,
      fromBlock: 100n,
      evetName: "Transfer",
    });
    const logs = await publicClient.getFilterLogs({ filter });
    console.log("resdata-----", logs);

    // let nftCount = logs.filter((e) => e.args.)
  };

  // 0xcC462Cae21b522b34acb02F3B7D0f4DC7B66933d

  return (
    <div className="w-full">
      <div style={{ right: "20px", top: "4px", position: "fixed" }}>
        {isConnected == false ? (
          <Button
            className={`uppercase`}
            variant={"outline"}
            borderRadius={"10px"}
            colorScheme="green"
            width={40}
            height={12}
            onClick={() => {
              setActiveDisconnect(false);
              connect();
            }}
          >
            Connect
          </Button>
        ) : (
          <Flex
            as="div"
            className="!border-[#EB00FF]"
            border={"2px"}
            width={40}
            height={12}
            borderRadius={"full"}
            alignItems={"center"}
          >
            <Popover>
              <PopoverTrigger>
                <IconButton
                  _hover={{
                    boxShadow: "0px 0px 26px 10px rgba(0, 213, 75, 0.8)",
                  }}
                  className="!bg-[#EB00FF]"
                  icon={<FaWallet color="white" />}
                  marginLeft={"2px"}
                  fontSize={20}
                  borderRadius={"full"}
                ></IconButton>
              </PopoverTrigger>
              <PopoverContent
                bgColor={"black"}
                width={"120px"}
                borderRadius={"16px"}
              >
                <PopoverArrow bgColor={"black"} />
                <PopoverBody className="lowercase" padding={0}>
                  <Button
                    width={"full"}
                    borderRadius={"16px"}
                    borderBottomRadius={0}
                    colorScheme="green"
                    variant={"ghost"}
                    onClick={() => {
                      setActiveDisconnect(true);
                      disconnect();
                    }}
                  >
                    Disconnect
                  </Button>
                  <div className="w-full h-[1px] bg-white" />
                  <Button
                    width={"full"}
                    borderRadius={"16px"}
                    borderTopRadius={0}
                    colorScheme="green"
                    variant={"ghost"}
                  >
                    Escrows
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Text className="font-light pt-[4px] pl-[8px]" fontSize={"18px"}>
              ...{address.slice(-4)}
            </Text>
          </Flex>
        )}
      </div>
    </div>
    // <div>
    //   <div>
    //     <h1>Frontend Test</h1>
    //   </div>
    //   <div>
    //     <Button colorScheme="facebook" onClick={connectWallet}>
    //       Connect Wallet
    //     </Button>
    //   </div>
    //   <div>
    //     <input
    //       type="text"
    //       value={address}
    //       onChange={(e) => setInputAddress(e.target.value)}
    //       placeholder="Enter NFT contract address"
    //     />
    //     <Button onClick={fetchNFTs}>Fetch NFTs</Button>
    //   </div>

    //   <h2>Your NFTs:</h2>
    //   <ul></ul>
    // </div>
  );
}

export default Main;
