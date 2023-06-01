import RunnerSoulABI from "@/abi/RunnerSoul.abi.json";
import RTWABI from "@/abi/RTW.abi.json";
import Factory from "@/abi/Factory.abi.json";
import ERC20 from "@/abi/ERC20.abi.json";
import Mission from "@/abi/Mission.abi.json";


export const WALLET_CONNECT_PROJECT_ID = "d4409277b84d4f2bb8bbef243bb68440";

export const RUNNER_SOUL_CONTRACT = {
    address: "0x4916823E4d3b01568D8868Ea911ceEe2987b196B",
    abi: RunnerSoulABI
}
export const RTW_CONTRACT = {
    address: "0xcF08014C64F40B6B69B082b54c0234b53b8911fB",
    abi: RTWABI
}
export const FACTORY_CONTRACT = {
    address: "0xA595F502e9cE7066FEd26DB89Bd45af1988aC9B7",
    abi: Factory
}
export const MISSION_CONTRACT = {
    abi: Mission
}
export const ERC20_CONTRACT = {
    abi: ERC20
}
