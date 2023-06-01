import React from "react";
import { Button } from "rsuite";

import * as wagmi from "wagmi";
import { Web3Button } from "@web3modal/react";


export default function ConnectWalletButton() {
    const account = wagmi.useAccount();
    const balance = wagmi.useBalance({
        address: account.address,
    });

    const connectedButton = (
        <Button
            appearance="ghost"
        >
            Connected&nbsp;
            {account.address?.slice(0, 9)}...
            ({balance.data?.formatted.slice(0, 7)} ETH)
        </Button>
    );
    const connectButton = (
        <Web3Button />
    );
    return connectButton;
    // return <div>{account.isConnected ? connectedButton : connectButton}</div>
}
