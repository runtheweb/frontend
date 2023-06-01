import { Button, Divider, Nav, Navbar, Panel, PanelGroup } from "rsuite";

import * as colors from "@/components/colors";
import ConnectWalletButton from "@/components/ConnectWallet";
import NavigationView from "@/components/Navigation";
import SoulView from "@/components/dapp/Soul";
import MissionsView from "@/components/dapp/missions/View";

export default function DApp() {
    return (
        <>
            <NavigationView />
            <div style={{ padding: 10, maxWidth: 1150, margin: "0 auto"}}>
                <SoulView />
                <Divider />
                <MissionsView />
            </div>
        </>
    );
}
