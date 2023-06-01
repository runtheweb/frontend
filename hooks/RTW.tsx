import * as wagmi from "wagmi";
import { ethers } from "ethers";

import { RTW_CONTRACT, RUNNER_SOUL_CONTRACT } from "@/hooks/consts";
import { withWaiterHook, withSigningHook, wrapWriteCallback } from "@/components/WalletNotifications";
import { useToaster } from "rsuite";



export function fetchAllowanceFor({spender}: {
    spender: string
}): undefined | ethers.BigNumber {
    const account = wagmi.useAccount();
    const allowance = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...RTW_CONTRACT,
        functionName: "allowance",
        args: [account.address, spender],
        watch: true
    });
    return allowance.data;
}

export function fetchBalance(): undefined | ethers.BigNumber {
    const account = wagmi.useAccount();
    const allowance = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...RTW_CONTRACT,
        functionName: "balanceOf",
        args: [account.address],
        watch: true
    });
    return allowance.data;
}

export function approveFor({spender, amount}: {
    spender: string,
    amount: ethers.BigNumber
}): undefined | Function {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...RTW_CONTRACT,
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
