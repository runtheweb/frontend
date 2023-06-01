import * as wagmi from "wagmi";
import { ethers } from "ethers";

import { ERC20_CONTRACT, FACTORY_CONTRACT, RTW_CONTRACT, RUNNER_SOUL_CONTRACT } from "@/hooks/consts";
import { withWaiterHook, withSigningHook, wrapWriteCallback } from "@/components/WalletNotifications";
import { useToaster } from "rsuite";


export function fetchAllowanceFor({
    token, spender
}: {
    token: string,
    spender: string
}): undefined | ethers.BigNumber {
    const account = wagmi.useAccount();
    const allowance = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...ERC20_CONTRACT,
        address: token,
        functionName: "allowance",
        args: [account.address, spender],
        watch: true
    });
    return allowance.data;
}


export function fetchNameOf({
    token
}: {
    token: string
}): undefined | string {
    const allowance = wagmi.useContractRead<any, any, string>({
        ...ERC20_CONTRACT,
        address: token,
        functionName: "name",
        watch: true
    });
    return allowance.data;
}


export function fetchDecimalsOf({
    token
}: {
    token: string
}): undefined | string {
    const allowance = wagmi.useContractRead<any, any, string>({
        ...ERC20_CONTRACT,
        address: token,
        functionName: "decimals",
        watch: true
    });
    return allowance.data;
}

export function fetchSymbolOf({
    token
}: {
    token: string
}): undefined | string {
    const allowance = wagmi.useContractRead<any, any, string>({
        ...ERC20_CONTRACT,
        address: token,
        functionName: "symbol",
        watch: true
    });
    return allowance.data;
}

export function fetchMyBalance({
    token
}: {
    token: string
}): undefined | ethers.BigNumber {
    const account = wagmi.useAccount();
    const allowance = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...ERC20_CONTRACT,
        address: token,
        functionName: "balanceOf",
        args: [account.address],
        watch: true
    });
    return allowance.data;
}

export function approve({token, spender, amount}: {
    token: string,
    spender: string,
    amount: ethers.BigNumber
}): undefined | Function {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...ERC20_CONTRACT,
        address: token,
        functionName: "approve",
        args: [spender, amount],
    });
    const signedTx = wagmi.useContractWrite(
        withSigningHook(broadcastPreparation.config, toaster)
    );
    const signWaiter = wagmi.useWaitForTransaction(
        withWaiterHook({
            hash: signedTx.data?.hash,
        }, toaster)
    );
    return wrapWriteCallback(signedTx.write, broadcastPreparation, toaster);
}
