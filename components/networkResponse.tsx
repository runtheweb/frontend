import React from "react";

export default function checkNetworkResponse<CBReturnType>(callback: () => CBReturnType, values: any[]): CBReturnType | undefined {
    let passed = true;
    values.forEach((item, index) => {
        if (item.data === undefined || item.data === null) passed = false
    })
    return passed ? callback() : undefined
}
