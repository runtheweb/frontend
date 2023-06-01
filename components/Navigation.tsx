import { Navbar, Nav } from "rsuite";

import ConnectWalletButton from "@/components/ConnectWallet";

export default function NavigationView() {
    return (
        <Navbar>
            <Nav pullRight>
                <Nav.Item>
                    <ConnectWalletButton />
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}
