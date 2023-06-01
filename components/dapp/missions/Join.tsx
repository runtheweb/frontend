import React from "react";
import { Button, Drawer, Input, Form, ButtonGroup } from "rsuite";
import { ethers } from "ethers";
import InputAmount, { InputJSFillNumber } from "@/components/InputAmount";

import * as RTWContract from "@/hooks/RTW";
import * as RunnerSoulContract from "@/hooks/RunnerSoul"
import * as ERC20 from "@/hooks/ERC20";
import * as Factory from "@/hooks/Factory";
import * as MissionContract from "@/hooks/Mission";
import * as colors from "@/components/colors";
import roundBN from "@/hooks/formatting";
import { FACTORY_CONTRACT } from "@/hooks/consts";



export default function JoinMissionDrawer({
    open, setOpen, missionAddress
}: {
    open: boolean,
    setOpen: (_: boolean) => any,
    missionAddress: string
}) {
    const rtwBalance = RTWContract.fetchBalance();
    const [pledgeAmount, setPledgeAmount] = React.useState(
        ethers.BigNumber.from(0)
    );
    const [pledgeReputation, setPledgeReputation] = React.useState(
        ethers.BigNumber.from(0)
    );
    const soul = RunnerSoulContract.fetchSoul();

    const joinMissionCallback = MissionContract.joinMission({
        mission: missionAddress,
        pledgeAmount, pledgeReputation
    })


    return (
        <Drawer size="full" placement="bottom" open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
            <Drawer.Title><h3>Join the mission</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{maxWidth: 1000, margin: "0 auto"}}>
                <InputAmount
                    title="Enter pledge amount"
                    value={pledgeAmount}
                    setValue={setPledgeAmount}
                    decimals={18}
                    decimalsShift={2}
                />
                <Form.HelpText>
                    Balance: {roundBN(rtwBalance, 5, 18)}
                </Form.HelpText>
                <br />
                <InputAmount
                    title="Enter pledge reputation"
                    value={pledgeReputation}
                    setValue={setPledgeReputation}
                    decimals={18}
                    decimalsShift={2}
                />
                <Form.HelpText>
                    Your reputation: {roundBN(soul?.reputation, 5, 18)}
                </Form.HelpText>

                <br />
                <Button
                    block
                    appearance="primary"
                    style={{
                        backgroundColor: colors.ALT_DARK
                    }}
                    onClick={async () => joinMissionCallback?.()}
                ><b>Join the mission</b></Button>
            </Drawer.Body>
        </Drawer>
    );
}
