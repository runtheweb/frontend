import type { ReactNode } from "react";

import { NextComponentType } from "next/types";
import { ethers } from "ethers";
import { Form, InputGroup, InputNumber } from "rsuite";
import roundBN from "@/hooks/formatting";

export default function InputAmount({
    title,
    value,
    setValue,
    decimals,
    decimalsShift,
    children
}: {
    title: string,
    value: ethers.BigNumber,
    setValue: (_: ethers.BigNumber) => void,
    decimals: number,
    decimalsShift: number,
    children?: ReactNode,
}) {
    return (
        <Form.Group controlId="_">
            <Form.ControlLabel>{title}</Form.ControlLabel>
            <InputGroup style={{ marginTop: 5, marginBottom: 5 }}>
                <InputGroup.Button
                    onClick={() =>
                        setValue(
                            value.sub(ethers.BigNumber.from(10).pow(decimals + decimalsShift))
                        )
                    }
                >
                    -
                </InputGroup.Button>
                <InputNumber
                    className="no-arrows-input-number"
                    step={0.1}
                    value={roundBN(value, 18, decimals)}
                    onChange={(val) =>
                        setValue(
                            ethers.utils.parseUnits(isNaN(parseInt(val)) ? "0" : val, decimals)
                        )
                    }
                />
                <InputGroup.Button
                    onClick={() =>
                        setValue(
                            value.add(ethers.BigNumber.from(10).pow(decimals + decimalsShift))
                        )
                    }
                >
                    +
                </InputGroup.Button>
            </InputGroup>
            {children}
        </Form.Group>
    );
}


export function InputJSFillNumber({
    title,
    value,
    setValue,
    decimalsShift,
    children
}: {
    title: string,
    value: number,
    setValue: (_: number) => void,
    decimalsShift: number,
    children?: ReactNode,
}) {
    return (
        <Form.Group controlId="_">
            <Form.ControlLabel>{title}</Form.ControlLabel>
            <InputGroup style={{ marginTop: 5, marginBottom: 5 }}>
                <InputGroup.Button
                    onClick={() =>
                        setValue(
                            value - 10**decimalsShift
                        )
                    }
                >
                    -
                </InputGroup.Button>
                <InputNumber
                    className="no-arrows-input-number"
                    step={0.1}
                    value={value}
                    onChange={(val) =>
                        setValue(
                            parseFloat(val)
                        )
                    }
                />
                <InputGroup.Button
                    onClick={() =>
                        setValue(
                            value + 10**decimalsShift
                        )
                    }
                >
                    +
                </InputGroup.Button>
            </InputGroup>
            {children}
        </Form.Group>
    );
}
