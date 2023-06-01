import React from "react";
import { PanelGroup, Button, Panel, Progress, Stack } from "rsuite";
import * as wagmi from "wagmi";

import * as colors from "@/components/colors";
import * as FactoryContract from "@/hooks/Factory";
import * as MissionContract from "@/hooks/Mission";
import * as ERC20Contract from "@/hooks/ERC20";
import roundBN from "@/hooks/formatting";
import CreateNewMissionDrawer from "@/components/dapp/missions/Create";
import JoinMissionDrawer from "@/components/dapp/missions/Join";
import VoteDrawer from "@/components/dapp/missions/Voting";
import PushProofDrawer from "./PushProof";
import { DecreasingTimer } from "@/components/Clock";


export function CreateNewMissionButton() {

    const [drawerOpened, setDrawerOpened] = React.useState<boolean>(false);

    return (
        <div style={{marginLeft: 20, marginRight: 20}}>
            <h3>Missions</h3>
            <br/>
            <Button
                block
                appearance="ghost"
                style={{
                    borderColor: colors.SECONDARY,
                    borderWidth: 2
                }}
                onClick={() => setDrawerOpened(true)}
            >
                <b>Create new</b>
            </Button>
            <CreateNewMissionDrawer open={drawerOpened} setOpen={setDrawerOpened} />
        </div>
    );
}


export function MissionView({
    missionAddress,
}: {
    missionAddress: string,
}) {

    const now = Math.round(Date.now() / 1000);

    const account = wagmi.useAccount();
    const missionInfo = MissionContract.fetchMainInfo(missionAddress);
    const opTokenSymbol = ERC20Contract.fetchSymbolOf({ token: missionInfo?.operationToken ?? "0x0" })
    const opTokenDecimals = ERC20Contract.fetchDecimalsOf({ token: missionInfo?.operationToken ?? "0x0" })
    const joiningRate = MissionContract.joiningRate({ mission: missionAddress })

    const amIRunner = MissionContract.amIRunner({ mission: missionAddress });

    const [joinMissionOpened, setJoinMissionOpened] = React.useState<boolean>(false);

    const leaveMissionCallback = MissionContract.leaveMission({
        mission: missionAddress
    });

    const initMissionCallback = MissionContract.initMission({
        mission: missionAddress
    })
    const startMissionCallback = MissionContract.startMission({
        mission: missionAddress
    })
    const endMissionCallback = MissionContract.endMission({
        mission: missionAddress
    })
    const withdrawCollateralCallback = MissionContract.withdrawCollateral({
        mission: missionAddress
    })
    const myRole = MissionContract.fetchMyRole({
        mission: missionAddress
    });

    let myRoleString = "UNKNOWN";
    if (myRole === MissionContract.MissionRole.COURIER) {
        myRoleString = "COURIER"
    } else if (myRole === MissionContract.MissionRole.ARBITER) {
        myRoleString = "ARBITER"
    }

    const [voteDrawerOpened, setVoteDrawerOpened] = React.useState<boolean>(false);
    const [pushProofDrawerOpened, setPushProofDrawerOpened] = React.useState<boolean>(false);

    const [voteButtonDisabled, setVoteButtonDisabled] = React.useState(
        (now > missionInfo?.startTime && now < missionInfo?.startTime + missionInfo?.executionTime)
        || (now > missionInfo?.startTime + missionInfo?.executionTime + missionInfo?.ratingTime)
    );

    return (
        <Panel
            header={<span>Mission <span style={{ color: "grey" }}>(#{missionInfo?.id.toNumber()}, {missionAddress?.slice(0, 15)})</span></span>}
            bordered
            shaded
            defaultExpanded={false}
            collapsible
        >
            <dl>
                <dt>Codex</dt>
                <dd>{missionInfo?.codex}</dd>
                <dt>Creator</dt>
                <dd>{missionInfo?.creator}</dd>
                <dt>Execution duration</dt>
                <dd>{missionInfo?.executionTime / 60} min</dd>
                <dt>Voting time</dt>
                <dd>{missionInfo?.ratingTime / 60} min</dd>
                <dt>Roles</dt>
                <dd>{missionInfo?.numberOfCouriers} couriers / {missionInfo?.numberOfArbiters} arbiters </dd>
                <dt>OP token</dt>
                <dd>{roundBN(missionInfo?.totalOperationAmount, 18, opTokenDecimals ?? 1)} {opTokenSymbol} ({missionInfo?.operationToken})</dd>
                <dt>Min collateral per runner</dt>
                <dd>{roundBN(missionInfo?.minTotalCollateralPledge, 5, 18)} RTW</dd>
                <dt>Joined</dt>
                <dd>
                    <Progress.Line percent={joiningRate} strokeColor="#DDFF2A" />
                </dd>
                <hr />
                <dt>Role</dt>
                <dd>{myRoleString}</dd>
                <dt>Reward</dt>
                <dd>{roundBN(missionInfo?.totalRewardAmount, 5, 18)} RTW</dd>
            </dl>
            {
                missionInfo?.creator === account.address ? (
                    <>
                        <br />
                        {
                            missionInfo?.creator === account.address && missionInfo?.status === MissionContract.MissionStatus.CREATED ?
                            <Button
                                appearance="ghost"
                                block
                                style={{
                                    borderColor: colors.SECONDARY,
                                }}
                                onClick={async () => initMissionCallback()}
                            ><b>Init mission</b></Button>
                            : <></>
                        }
                        {
                            missionInfo?.creator === account.address && missionInfo?.status === MissionContract.MissionStatus.INITIALIZED ?
                            <Button
                                appearance="ghost"
                                block
                                style={{
                                    borderColor: colors.SECONDARY
                                }}
                                onClick={async () => startMissionCallback()}
                            ><b>Start mission</b></Button>
                            : <></>
                        }
                        {
                            missionInfo?.creator === account.address && missionInfo?.status === MissionContract.MissionStatus.STARTED ?
                            <Button
                                appearance="ghost"
                                block
                                style={{
                                    borderColor: colors.ALT,
                                    color: colors.ALT
                                }}
                                onClick={async () => endMissionCallback()}
                            ><b>End mission</b></Button>
                            : <></>
                        }

                    </>
                ) : <></>
            }
            {
                missionInfo?.status === MissionContract.MissionStatus.CREATED ? (amIRunner ?
                (
                    <>
                        <br />
                        <Button
                            appearance="primary"
                            style={{backgroundColor: colors.ALT_DARK}}
                            block
                            onClick={async () => leaveMissionCallback()}
                        >
                            <b>Leave</b>
                        </Button>
                    </>

                )
                : (
                    <>
                        <br />
                        <Button
                            appearance="primary"
                            style={{backgroundColor: colors.SECONDARY}}
                            block
                            onClick={() => setJoinMissionOpened(true)}
                        >
                            <b>Join</b>
                        </Button>
                    </>
                )) : <></>
            }
            {
                missionInfo?.status === MissionContract.MissionStatus.ENDED
                && amIRunner // Check withdraws
                ?
                <>
                    <br />
                    <Button
                        appearance="primary"
                        style={{backgroundColor: colors.ALT_DARK}}
                        block
                        onClick={() => withdrawCollateralCallback()}
                    >
                        <b>Withdraw collateral</b>
                    </Button>
                </>
                : <></>
            }
            {
                myRole === MissionContract.MissionRole.ARBITER && missionInfo?.status == MissionContract.MissionStatus.STARTED ?
                <>
                    <br />
                    <Button
                        appearance="primary"
                        style={{ backgroundColor: colors.ALT }}
                        block
                        disabled={voteButtonDisabled || missionInfo?.startTime + missionInfo?.executionTime + missionInfo?.ratingTime < now}
                        onClick={() => {
                            setVoteDrawerOpened(true)
                        }}
                    >
                        <b>Vote for runners {
                        (now > missionInfo?.startTime && now < missionInfo?.startTime + missionInfo?.executionTime) ?
                        <>
                            (unlocks in <DecreasingTimer secondsFrom={missionInfo?.startTime + missionInfo?.executionTime - now} onExpired={() => setVoteButtonDisabled(false)}/>)
                        </>
                        : (
                            missionInfo?.startTime + missionInfo?.executionTime + missionInfo?.ratingTime > now
                            ? <>
                                (ends in <DecreasingTimer secondsFrom={missionInfo?.startTime + missionInfo?.executionTime + missionInfo?.ratingTime - now} onExpired={() => setVoteButtonDisabled(true)}/>)
                            </>
                            : <>ended</>
                        )
                    }</b>
                    </Button>
                </>
                : <></>
            }
            {
                myRole === MissionContract.MissionRole.COURIER && missionInfo?.status == MissionContract.MissionStatus.STARTED ?
                <>
                    <br />
                    <Button
                        appearance="primary"
                        style={{ backgroundColor: colors.ALT }}
                        block
                        onClick={() => {
                            setPushProofDrawerOpened(true)
                        }}
                    >
                        <b>Push proof (ends in <DecreasingTimer secondsFrom={missionInfo.startTime + missionInfo.executionTime - now} />)</b>
                    </Button>
                </>
                : <></>
            }
            <PushProofDrawer open={pushProofDrawerOpened} setOpen={setPushProofDrawerOpened} mission={missionAddress} endTime={missionInfo?.startTime + missionInfo?.executionTime} />
            <VoteDrawer open={voteDrawerOpened} setOpen={setVoteDrawerOpened} mission={missionAddress} startTime={missionInfo?.startTime} executionDuration={missionInfo?.executionTime} rateDuration={missionInfo?.ratingTime} />
            <JoinMissionDrawer open={joinMissionOpened} setOpen={setJoinMissionOpened} missionAddress={missionAddress} />
        </Panel>
    );
}


export default function MissionsView() {

    const missions = FactoryContract.fetchMissions();

    return (
        <PanelGroup accordion>
            <CreateNewMissionButton />
            <Panel defaultExpanded header="Available">
                {
                    missions?.map(address => <><MissionView missionAddress={address} /><br /></>)
                }
                <br />
            </Panel>
        </PanelGroup>
    );
}
