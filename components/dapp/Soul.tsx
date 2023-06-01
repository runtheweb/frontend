import { Button, ButtonGroup, Form, Panel } from "rsuite";

import * as colors from "@/components/colors";
import * as RunnerSoulContract from "@/hooks/RunnerSoul";
import * as RTWContract from "@/hooks/RTW";
import { RUNNER_SOUL_CONTRACT } from "@/hooks/consts";
import { ethers } from "ethers";
import roundBN from "@/hooks/formatting";


export default function SoulView() {
    const mySoul = RunnerSoulContract.fetchSoul();
    const soulPrice = RunnerSoulContract.fetchSoulPrice();
    const rtwBalance = RTWContract.fetchBalance();
    const runnerSoulRTWAllowance = RTWContract.fetchAllowanceFor({
        spender: RUNNER_SOUL_CONTRACT.address
    });
    const approveCallback = RTWContract.approveFor({
        spender: RUNNER_SOUL_CONTRACT.address,
        amount: soulPrice ?? ethers.BigNumber.from(0)
    });
    const mintSoulCallback = RunnerSoulContract.mintSoul();
    const burnSoulCallback = RunnerSoulContract.burnSoul();
    return (
        <Panel
            style={{
                marginTop: 10,
                marginLeft: 20,
                marginRight: 20
            }}
            header={<h3>Your soul</h3>}
            bordered
            shaded
        >
            {
                mySoul ?
                 <dl>
                    <dt>Reputation</dt>
                    <dd>{roundBN(mySoul.reputation, 18, undefined)} RTW </dd>
                    <dt>Soul Price</dt>
                    <dd>{roundBN(mySoul.soulPrice, 18, undefined)} RTW</dd>
                </dl>
                : <>
                    <p>Nothing found. Mint tour soul before you start the job</p>
                    <br />
                </>

            }
            {
                mySoul ?
                <Button
                    appearance="ghost"
                    style={{
                        borderColor: colors.ALT,
                        color: colors.ALT
                    }}
                    block
                    onClick={async () => burnSoulCallback?.()}
                    // disabled={
                    //     runnerSoulRTWAllowance?.gte(soulPrice ?? ethers.BigNumber.from(0))
                    // }
                >
                    Burn your soul
                </Button>
                : <>
                    <ButtonGroup justified>
                        <Button
                            appearance="ghost"
                            style={{
                                borderColor: colors.ALT,
                                color: colors.ALT
                            }}
                            onClick={async () => approveCallback?.()}
                            disabled={
                                runnerSoulRTWAllowance?.gte(soulPrice ?? ethers.BigNumber.from(0))
                            }
                        >
                            Approve RTW
                        </Button>
                        <Button
                            disabled={
                                runnerSoulRTWAllowance?.lt(soulPrice ?? ethers.BigNumber.from(0))
                            }
                            appearance="primary"
                            style={{
                                backgroundColor: colors.ALT
                            }}
                            onClick={async () => mintSoulCallback?.()}
                        >
                            <b>Mint new soul</b>
                        </Button>
                    </ButtonGroup>
                    <br />
                    <Form.HelpText>
                        Soul price: {roundBN(runnerSoulRTWAllowance, 5, undefined)} RTW
                    </Form.HelpText>
                    <Form.HelpText>
                        Balance: {roundBN(rtwBalance, 5, undefined)} RTW
                    </Form.HelpText>
                    <Form.HelpText>
                        Allowance: {roundBN(runnerSoulRTWAllowance, 5, undefined)} RTW
                    </Form.HelpText>
                </>
            }
        </Panel>
    );
}
