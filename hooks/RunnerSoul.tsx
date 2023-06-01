import * as wagmi from "wagmi";
import { ethers } from "ethers";

import { RUNNER_SOUL_CONTRACT } from "@/hooks/consts";
import { withWaiterHook, withSigningHook, wrapWriteCallback } from "@/components/WalletNotifications";
import { useToaster } from "rsuite";


interface RunnerSoul {
    reputation: ethers.BigNumber,
    soulPrice: ethers.BigNumber,
}

export function fetchSoulPrice(): undefined | ethers.BigNumber {
    const soulPrice = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...RUNNER_SOUL_CONTRACT,
        functionName: "soulPrice",
    });
    return soulPrice.data;
}


export function fetchSoul(): undefined | RunnerSoul {
    const account = wagmi.useAccount();
    const doesSoulExist = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...RUNNER_SOUL_CONTRACT,
        functionName: "balanceOf",
        args: [account.address],
        watch: true
    });
    const soul = wagmi.useContractRead<any, any, [ethers.BigNumber, ethers.BigNumber]>({
        ...RUNNER_SOUL_CONTRACT,
        functionName: "souls",
        args: [account.address],
        watch: true
    })
    if (soul.data !== undefined && doesSoulExist.data !== undefined) {
        if (doesSoulExist.data.gt(0)) {
            return {
                reputation: soul.data[0],
                soulPrice: soul.data[0],
            }
        } else {
            return undefined;
        }
    }
}


export function mintSoul(): undefined | Function {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...RUNNER_SOUL_CONTRACT,
        functionName: "mintSoul",
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

export function burnSoul(): undefined | Function {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...RUNNER_SOUL_CONTRACT,
        functionName: "burnSoul",
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
