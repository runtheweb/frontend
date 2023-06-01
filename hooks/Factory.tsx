import * as wagmi from "wagmi";
import { ethers } from "ethers";

import { FACTORY_CONTRACT, RTW_CONTRACT, RUNNER_SOUL_CONTRACT } from "@/hooks/consts";
import { withWaiterHook, withSigningHook, wrapWriteCallback } from "@/components/WalletNotifications";
import { useToaster } from "rsuite";
import React, { useEffect } from "react";


export function createMission({
    codex,
    totalRewardAmount,
    totalOperationAmount,
    minTotalCollateralPledge,
    operationToken,
    numeberOfCouriers,
    numberOfArbiters,
    executionTime,
    ratingTime,
}: {
    codex: string,
    totalRewardAmount: ethers.BigNumber,
    totalOperationAmount: ethers.BigNumber,
    minTotalCollateralPledge: ethers.BigNumber,
    operationToken: string,
    numeberOfCouriers: number,
    numberOfArbiters: number,
    executionTime: number,
    ratingTime: number
}): undefined | Function {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...FACTORY_CONTRACT,
        functionName: "createMission",
        args: [
            codex,
            totalRewardAmount,
            totalOperationAmount,
            minTotalCollateralPledge,
            operationToken,
            numeberOfCouriers,
            numberOfArbiters,
            executionTime,
            ratingTime,
        ],
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


export function fetchMissions(): string[] | undefined {
    const missionsCount = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...FACTORY_CONTRACT,
        functionName: "totalMissions",
        watch: true
    })
    const missions = wagmi.useContractInfiniteReads<any, any, string>({
        cacheKey: 'missions',
        ...wagmi.paginatedIndexesConfig(
            (index) => {
                return [
                {
                    ...FACTORY_CONTRACT,
                    functionName: "missionList",
                    args: [ethers.BigNumber.from(index)] as const,
                },
                ]
            },
            {
                start: 0,
                perPage: missionsCount.data?.toNumber(),
                direction: "increment"
            },
        ),
    })
    useEffect(() => {
        missions.refetch()
    }, [missionsCount.data])


    return missions.data?.pages[0]
}
