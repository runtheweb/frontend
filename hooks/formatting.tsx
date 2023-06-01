import { ethers } from "ethers";

export default function roundBN(
    bn: ethers.BigNumber | undefined,
    roundTo: number,
    decimals: number | undefined
): string {
    let numberStringified = ethers.utils.formatUnits(bn?.toString() ?? "0", decimals ?? 18);
    const dotIndex = numberStringified.indexOf(".");
    numberStringified = numberStringified.slice(0, dotIndex) + "." + numberStringified.slice(dotIndex + 1, dotIndex + 1 + roundTo)
    if (numberStringified.endsWith(".0")) {
        numberStringified = numberStringified.slice(0, numberStringified.length - 2)
    }
    return numberStringified
}
