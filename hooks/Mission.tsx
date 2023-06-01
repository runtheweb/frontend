import * as wagmi from "wagmi";
import { ethers } from "ethers";

import { FACTORY_CONTRACT, MISSION_CONTRACT, RUNNER_SOUL_CONTRACT } from "@/hooks/consts";
import { withWaiterHook, withSigningHook, wrapWriteCallback } from "@/components/WalletNotifications";
import { useToaster } from "rsuite";
import React, { useEffect } from "react";


export enum MissionStatus {
    NONE,
    CREATED,
    INITIALIZED,
    STARTED,
    ENDED
}


export enum MissionRole {
    COURIER,
    ARBITER,
    UNKNOWN
}


interface MissionMainInfo {
    id: ethers.BigNumber,
    codex: string,
    totalRewardAmount: ethers.BigNumber,
    totalOperationAmount: ethers.BigNumber,
    minTotalCollateralPledge: ethers.BigNumber,
    operationToken: string,
    numberOfCouriers: number,
    numberOfArbiters: number,
    executionTime: number,
    ratingTime: number,
    creator: string,
    status: MissionStatus,
    startTime: number
}


export function fetchMainInfo(address: string): MissionMainInfo | undefined {
    const contract = {address: address, ...MISSION_CONTRACT}
    const mission = wagmi.useContractInfiniteReads({
        cacheKey: address,
        contracts() {
            return [
                { ...FACTORY_CONTRACT, functionName: "missionIds", args: [address]},
                { ...contract, functionName: "codex" },
                { ...contract, functionName: "runnerRewardAmount" },
                { ...contract, functionName: "totalOperationAmount" },
                { ...contract, functionName: "minRunnerCollateral" },
                { ...contract, functionName: "operationToken" },
                { ...contract, functionName: "numberOfCouriers" },
                { ...contract, functionName: "numberOfArbiters" },
                { ...contract, functionName: "executionTime" },
                { ...contract, functionName: "ratingTime" },
                { ...contract, functionName: "creator" },
                { ...contract, functionName: "status", watch: true},
                { ...contract, functionName: "startTime" }
            ]
        },
    })
    if (mission.data?.pages[0] !== undefined) {
        return {
            id: mission.data.pages[0][0],
            codex: mission.data.pages[0][1],
            totalRewardAmount: mission.data.pages[0][2],
            totalOperationAmount: mission.data.pages[0][3],
            minTotalCollateralPledge: mission.data.pages[0][4],
            operationToken: mission.data.pages[0][5],
            numberOfCouriers: mission.data.pages[0][6],
            numberOfArbiters: mission.data.pages[0][7],
            executionTime: mission.data.pages[0][8],
            ratingTime: mission.data.pages[0][9],
            creator: mission.data.pages[0][10],
            status: mission.data.pages[0][11],
            startTime: mission.data.pages[0][12]?.toNumber(),
        }
    }
    return undefined
}


export function joiningRate({mission}: {
    mission: string
}): number | undefined {
    const numberOfCouriers = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "numberOfCouriers",
        watch: true
    });
    const numberOfArbiters = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "numberOfArbiters",
        watch: true
    });
    const runners = wagmi.useContractInfiniteReads<any, any, string>({
        cacheKey: `runenrs${mission}`,
        ...wagmi.paginatedIndexesConfig(
            (index) => {
                return [
                {
                    ...MISSION_CONTRACT,
                    address: mission,
                    functionName: "runners",
                    args: [ethers.BigNumber.from(index)] as const,
                },
                ]
            },
            {
                start: 0,
                perPage: numberOfCouriers.data + numberOfArbiters.data,
                direction: "increment"
            },
        ),
    })
    useEffect(() => {
        runners.refetch()
    }, [numberOfCouriers.data, numberOfArbiters.data])

    return runners.data?.pages[0].filter(elem => elem).length / (numberOfCouriers.data + numberOfArbiters.data) * 100
}


export function joinMission({
    mission, pledgeAmount, pledgeReputation
}: {
    mission: string,
    pledgeAmount: ethers.BigNumber,
    pledgeReputation: ethers.BigNumber,
}) {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "joinMission",
        args: [pledgeAmount, pledgeReputation],
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

export function fetchRunnerProof({mission, runner}: {
    mission: string,
    runner: string
}): string | undefined {
    const proof = wagmi.useContractRead<any, any, string>({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "proofs",
        args: [runner],
        watch: true
    });
    return proof.data

}

export function leaveMission({
    mission
}: {
    mission: string,
}) {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "leaveMission",
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


export function withdrawCollateral({
    mission
}: {
    mission: string,
}) {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "withdrawCollateral",
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

export function pushProof({
    mission, proof
}: {
    mission: string,
    proof: string
}) {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "pushProof",
        args: [proof]
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

export function rateCouriers({
    mission, rates
}: {
    mission: string, rates: boolean[]
}) {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "rateCouriers",
        args: [rates]
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


export function initMission({
    mission
}: {
    mission: string,
}) {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "initMission",
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


export function startMission({
    mission
}: {
    mission: string,
}) {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "startMission",
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


export function endMission({
    mission
}: {
    mission: string,
}) {
    const toaster = useToaster();
    const broadcastPreparation = wagmi.usePrepareContractWrite({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "endMission",
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

export function amIRunner({
    mission
}: { mission: string }): boolean | undefined {
    const account = wagmi.useAccount()
    const myPosition = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "positions",
        args: [account.address],
        watch: true
    });
    return !myPosition.data?.[0].eq(0)
}


export function fetchCouriers({
    mission
}: {
    mission: string
}): string[] | undefined {
    const numberOfCouriers = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "numberOfCouriers",
        watch: true
    });
    const couriers = wagmi.useContractInfiniteReads<any, any, string>({
        cacheKey: `couriers${mission}`,
        ...wagmi.paginatedIndexesConfig(
            (index) => {
                return [
                {
                    ...MISSION_CONTRACT,
                    address: mission,
                    functionName: "couriers",
                    args: [ethers.BigNumber.from(index)] as const,
                },
                ]
            },
            {
                start: 0,
                perPage: numberOfCouriers.data,
                direction: "increment"
            },
        ),
    })
    useEffect(() => {
        couriers.refetch()
    }, [numberOfCouriers.data])

    return couriers.data?.pages[0]
}

export function fetchArbiters({
    mission
}: {
    mission: string
}): string[] | undefined {
    const numberOfArbiters = wagmi.useContractRead<any, any, ethers.BigNumber>({
        ...MISSION_CONTRACT,
        address: mission,
        functionName: "numberOfArbiters",
        watch: true
    });
    const arbiters = wagmi.useContractInfiniteReads<any, any, string>({
        cacheKey: `arbiters${mission}`,
        ...wagmi.paginatedIndexesConfig(
            (index) => {
                return [
                {
                    ...MISSION_CONTRACT,
                    address: mission,
                    functionName: "arbiters",
                    args: [ethers.BigNumber.from(index)] as const,
                },
                ]
            },
            {
                start: 0,
                perPage: numberOfArbiters.data,
                direction: "increment"
            },
        ),
    })
    useEffect(() => {
        arbiters.refetch()
    }, [numberOfArbiters.data])

    return arbiters.data?.pages[0]
}

export function fetchMyRole({
    mission
}: {
    mission: string
}): MissionRole {
    const account = wagmi.useAccount();
    const couriers = fetchCouriers({ mission })
    const arbiters = fetchArbiters({ mission })
    if (couriers?.includes(account.address)) {
        return MissionRole.COURIER
    } else if (arbiters?.includes(account.address)) {
        return MissionRole.ARBITER
    } else {
        return MissionRole.UNKNOWN
    }
}
