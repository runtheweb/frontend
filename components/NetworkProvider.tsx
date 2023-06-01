import React from "react";

import * as wagmi from "wagmi";
import * as web3modal from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import { WALLET_CONNECT_PROJECT_ID } from "hooks/consts";

export default function NetworkProvider({children, ...props}: {
    children: React.ReactNode
}) {
    const chains = [wagmi.chain.goerli];
    const { provider } = wagmi.configureChains(
        chains,
        [
            web3modal.walletConnectProvider({
                projectId: WALLET_CONNECT_PROJECT_ID,

            }),
        ]
    );
    const wagmiClient = wagmi.createClient({
        autoConnect: true,
        connectors: web3modal.modalConnectors({
            appName: "RunTheWeb",
            chains
        }),
        provider,
    });
    const ethereumClient = new web3modal.EthereumClient(wagmiClient, chains);
    return (
        <>
            <wagmi.WagmiConfig client={wagmiClient}>
                {children}
            </wagmi.WagmiConfig>
            <Web3Modal
                projectId={WALLET_CONNECT_PROJECT_ID}
                ethereumClient={ethereumClient}
                themeColor="blackWhite"
            />
        </>
    );
}
