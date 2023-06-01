import React from "react";
import { Button, Drawer, Input, Radio, RadioGroup, Panel, Form } from "rsuite";
import { ethers } from "ethers";
import InputAmount, { InputJSFillNumber } from "@/components/InputAmount";

import * as MissionContract from "@/hooks/Mission";
import * as ERC20 from "@/hooks/ERC20";
import * as Factory from "@/hooks/Factory";
import * as colors from "@/components/colors";
import roundBN from "@/hooks/formatting";
import { FACTORY_CONTRACT } from "@/hooks/consts";
import { DecreasingTimer } from "@/components/Clock";



export default function PushProofDrawer({
    open,
    setOpen,
    mission,
    endTime
}: {
    open: boolean,
    setOpen: (_: boolean) => any,
    mission: string,
    endTime: number
}) {

    const [proof, setProof] = React.useState([]);

    const pushProofCallback = MissionContract.pushProof({
        mission, proof
    })
    const [pushButtonDisabled, setPushButtonDisabled] = React.useState(endTime < Date.now());


    return (
        <Drawer size="full" placement="bottom" open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
                <Drawer.Title><h3>Push proof</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{ maxWidth: 1000, margin: "0 auto" }}>
                <Form.ControlLabel>
                    Provide proofs you've done the mission
                </Form.ControlLabel>
                <Input
                    as="textarea"
                    value={proof}
                    onChange={setProof}
                />
                <br />
                <Button
                    appearance="primary"
                    style={{ backgroundColor: colors.ALT }}
                    disabled={pushButtonDisabled}
                    block
                    onClick={async () => pushProofCallback()}
                >
                    <b>Push proof {
                        endTime >= Math.round(Date.now() / 1000) ?
                        <>
                            (ends in <DecreasingTimer secondsFrom={endTime - Math.round(Date.now() / 1000)} onExpired={() => setPushButtonDisabled(true)}/>)
                        </>
                        : <></>
                    }</b>
                </Button>
            </Drawer.Body>
        </Drawer>
    );
}
