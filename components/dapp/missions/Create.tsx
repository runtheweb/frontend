import React from "react";
import { Button, Drawer, Input, Form, ButtonGroup } from "rsuite";
import { ethers } from "ethers";
import InputAmount, { InputJSFillNumber } from "@/components/InputAmount";

import * as RTWContract from "@/hooks/RTW";
import * as ERC20 from "@/hooks/ERC20";
import * as Factory from "@/hooks/Factory";
import * as colors from "@/components/colors";
import roundBN from "@/hooks/formatting";
import { FACTORY_CONTRACT, RTW_CONTRACT } from "@/hooks/consts";

export default function CreateNewMissionDrawer({
    open, setOpen
}: {
    open: boolean,
    setOpen: (_: boolean) => any
}) {
    const [codex, setCodex] = React.useState<string>("");
    const [totalRewardAmount, setTotalRewardAmount] = React.useState<ethers.BigNumber>(
        ethers.BigNumber.from(0)
    );
    const [totalOperationAmount, setTotalOperationAmount] = React.useState(
        ethers.BigNumber.from(0)
    );
    const [minTotalCollateralPledge, setMinTotalCollateralPledge] = React.useState(
        ethers.BigNumber.from(0)
    );
    const [operationToken, setOperationToken] = React.useState("0x0");
    const [numeberOfCouriers, setNumeberOfCouriers] = React.useState<number>(0);
    const [numberOfArbiters, setNumberOfArbiters] = React.useState<number>(0);
    const [executionTime, setExecutionTime] = React.useState<number>(0);
    const [ratingTime, setRatingTime] = React.useState<number>(0);

    const rtwBalance = RTWContract.fetchBalance();
    const rtwAllowance = RTWContract.fetchAllowanceFor({
        spender: FACTORY_CONTRACT.address
    });
    const operationTokenName = ERC20.fetchNameOf({ token: operationToken });
    const operationTokenSymbol = ERC20.fetchSymbolOf({ token: operationToken });
    const operationTokenBalance = ERC20.fetchMyBalance({ token: operationToken });
    const operationTokenAllowance = ERC20.fetchAllowanceFor({
        token: operationToken,
        spender: FACTORY_CONTRACT.address
    })

    const approveRTWCallback = RTWContract.approveFor({
        spender: FACTORY_CONTRACT.address,
        amount: operationToken === RTW_CONTRACT.address ? totalRewardAmount.add(totalOperationAmount) : totalRewardAmount
    })
    const approveOPCallback = ERC20.approve({
        token: operationToken,
        spender: FACTORY_CONTRACT.address,
        amount: totalOperationAmount
    })
    const createMissionCallback = Factory.createMission({
        codex, totalOperationAmount,
        totalRewardAmount, minTotalCollateralPledge,
        operationToken, numeberOfCouriers,
        numberOfArbiters,
        executionTime: executionTime * 60,
        ratingTime: ratingTime * 60
    })


    return (
        <Drawer size="full" placement="bottom" open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
            <Drawer.Title><h3>Create new mission</h3></Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{maxWidth: 1000, margin: "0 auto"}}>
                <Form.ControlLabel>Provide mission description</Form.ControlLabel>
                <Input as="textarea" value={codex} onChange={setCodex} />
                <br />
                <InputAmount
                    title="Enter RTW reward amount"
                    value={totalRewardAmount}
                    setValue={setTotalRewardAmount}
                    decimals={18}
                    decimalsShift={2}
                >
                    <Form.HelpText>
                        Balance: {roundBN(rtwBalance, 5, 18)}
                    </Form.HelpText>
                    <Form.HelpText>
                        Allowance: {roundBN(rtwAllowance, 5, 18)}
                    </Form.HelpText>
                </InputAmount>
                <br />
                <InputAmount
                    title="Enter RTW minimum collateral pledge amount"
                    value={minTotalCollateralPledge}
                    setValue={setMinTotalCollateralPledge}
                    decimals={18}
                    decimalsShift={2}
                />
                <hr />
                <Form.ControlLabel>Provide operation token address (ERC20)</Form.ControlLabel>
                <Input value={operationToken} onChange={setOperationToken} />
                <Form.HelpText>
                    Token: {operationTokenName} ({operationTokenSymbol})
                </Form.HelpText>
                <br />
                <InputAmount
                    title="Enter token operation amount"
                    value={totalOperationAmount}
                    setValue={setTotalOperationAmount}
                    decimals={18}
                    decimalsShift={2}
                >
                <Form.HelpText>
                    Balance: {roundBN(operationTokenBalance, 5, 18)}
                </Form.HelpText>
                <Form.HelpText>
                    Allowance:  {roundBN(operationTokenAllowance, 5, 18)}
                </Form.HelpText>
                </InputAmount>
                <hr />
                <InputJSFillNumber
                    title="Enter count of couriers"
                    value={numeberOfCouriers}
                    setValue={setNumeberOfCouriers}
                    decimalsShift={1}
                />
                <br />
                <InputJSFillNumber
                    title="Enter count of Arbiters"
                    value={numberOfArbiters}
                    setValue={setNumberOfArbiters}
                    decimalsShift={1}
                />
                <hr />
                <InputJSFillNumber
                    title="Enter execution time duration (in mins)"
                    value={executionTime}
                    setValue={setExecutionTime}
                    decimalsShift={0}
                />
                <br />
                <InputJSFillNumber
                    title="Enter voting time duration (in mins)"
                    value={ratingTime}
                    setValue={setRatingTime}
                    decimalsShift={0}
                />
                <hr />
                <ButtonGroup justified>
                    <Button
                        appearance="ghost"
                        style={{
                            borderColor: colors.PRIMARY,
                            color: colors.PRIMARY
                        }}
                        disabled={rtwAllowance?.gte(totalRewardAmount)}
                        onClick={async () => approveRTWCallback?.()}
                    >Approve RTW</Button>
                    {
                        operationToken === RTW_CONTRACT.address ?
                        <></>
                        : (
                            <Button
                                appearance="ghost"
                                style={{
                                    borderColor: colors.PRIMARY,
                                    color: colors.PRIMARY
                                }}
                                disabled={operationTokenAllowance?.gte(totalOperationAmount)}
                                onClick={async () => approveOPCallback?.()}
                            >Approve {operationTokenSymbol}</Button>
                        )
                    }

                </ButtonGroup>
                <br />
                <Button
                    block
                    appearance="primary"
                    disabled={!rtwAllowance?.gte(totalRewardAmount) || !operationTokenAllowance?.gte(totalOperationAmount)}
                    style={{
                        backgroundColor: colors.ALT_DARK
                    }}
                    onClick={async () => createMissionCallback?.()}
                ><b>Create new mission</b></Button>
            </Drawer.Body>
        </Drawer>
    );
}
