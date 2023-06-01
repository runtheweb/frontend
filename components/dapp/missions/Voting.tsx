import React from "react";
import { Button, Drawer, Input, Radio, RadioGroup, Panel } from "rsuite";
import { ethers } from "ethers";
import InputAmount, { InputJSFillNumber } from "@/components/InputAmount";

import * as MissionContract from "@/hooks/Mission";
import * as ERC20 from "@/hooks/ERC20";
import * as Factory from "@/hooks/Factory";
import * as colors from "@/components/colors";
import roundBN from "@/hooks/formatting";
import { FACTORY_CONTRACT } from "@/hooks/consts";
import { DecreasingTimer } from "@/components/Clock";


export function VoteRunnerPanel({mission, runner, votings, index}: {index: number, mission: string, runner: string, votings: any[]}) {

    const proof = MissionContract.fetchRunnerProof({
        mission, runner
    })
    const [proofMarkered, setProofMarkerd] = React.useState<boolean>(false);
    const [decisionResult, setDecisionResult] = React.useState<string | undefined>();

    return (
        <Panel header={runner} bordered shaded expanded>
            <dl>
                <dt>Proof</dt>
                <dd>{proof}</dd>
                <dt>Decision</dt>
                <dd>
                    <RadioGroup value={decisionResult} onChange={(value) => {
                        const currentOccurIndex = votings.findIndex(value => value[0] === index)
                        if (currentOccurIndex === -1) {
                            votings.push([index, value === "PASSED"])
                        } else {
                            votings[currentOccurIndex] = [index, value === "PASSED"]
                        }
                        setDecisionResult(value)
                    }} inline>
                        <Radio value="PASSED" onChange={() => {
                            // votings.push([index, true])
                        }}>Passed</Radio>
                        <Radio value="FAILED" onChange={() => {
                            // votings.push([index, false])
                        }}>Failed</Radio>
                    </RadioGroup>
                </dd>
            </dl>
        </Panel>
    );
}

export default function VoteDrawer({
    open,
    setOpen,
    mission,
    startTime,
    executionDuration,
    rateDuration,

}: {
    open: boolean,
    setOpen: (_: boolean) => any,
    mission: string,
    startTime: number | undefined,
    executionDuration: number | undefined,
    rateDuration: number | undefined,
}) {
    const now = Math.round(Date.now() / 1000)
    const [votingResult, setVotingResult] = React.useState([]);
    const couriers = MissionContract.fetchCouriers({ mission });

    const voteForCouriersCallback = MissionContract.rateCouriers({
        mission, rates: votingResult
            .sort((a, b) => a[0] - b[0])
            .map(elem => elem[1])
    })
    const [voteButtonDisabled, setVoteButtonDisabled] = React.useState(
        (now > startTime && now < startTime + executionDuration)
        || (startTime + executionDuration + rateDuration < now)
    );

    return (
        <Drawer size="full" placement="bottom" open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
                <Drawer.Title><h3>Vote for runners</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{ maxWidth: 1000, margin: "0 auto" }}>
                {
                    couriers?.map(
                        (courier, ind) => <VoteRunnerPanel index={ind} mission={mission} runner={courier} votings={votingResult} />
                    )
                }
                <br />
                <Button
                    appearance="primary"
                    style={{ backgroundColor: colors.ALT }}
                    block
                    disabled={votingResult.length !== couriers?.length || (
                        (now > startTime && now < startTime + executionDuration)
                        || (startTime + executionDuration + rateDuration < now)
                    )}
                    onClick={async () => voteForCouriersCallback()}
                >
                    <b>Vote for runners {
                        (now > startTime && now < startTime + executionDuration) ?
                        <>
                            (unlocks in <DecreasingTimer secondsFrom={startTime + executionDuration - now} onExpired={() => setVoteButtonDisabled(false)}/>)
                        </>
                        : (
                            startTime + executionDuration + rateDuration > now
                            ? <>
                                (ends in <DecreasingTimer secondsFrom={startTime + executionDuration + rateDuration - now} onExpired={() => setVoteButtonDisabled(true)}/>)
                            </>
                            : <>ended</>
                        )
                    }</b>
                </Button>
            </Drawer.Body>
        </Drawer>
    );
}
