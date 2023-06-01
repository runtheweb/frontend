import { Button, ButtonGroup, Panel, Stack } from "rsuite";
import Image from "next/image";

import * as colors from "@/components/colors";

export default function Home() {
    return (
        <>
            <div style={{
                color: "white",
                zIndex: 1000,
                paddingLeft: "8%",
                paddingTop: "15%",
                paddingRight: "10%",
            }}>
                <Stack>
                    <div>
                        <div>
                            <h1 style={{
                                fontFamily: "custom",
                                letterSpacing: 5,
                                fontSize: 70
                            }}>RunTheWeb</h1>
                            <h5 style={{paddingTop: 10}}>Treasury ops for DAOs and individuals.</h5>
                        </div>
                        <br />
                        <Stack>
                            <Button
                                appearance="primary"
                                style={{width: 200, backgroundColor: colors.SECONDARY}}
                                onClick={() => {
                                    document.location.href = "dapp";
                                }}
                            >
                                <b>Launch dApp</b>
                            </Button>
                        </Stack>
                    </div>

                    {/* <Image
                        src="/runtheweb-square.png"
                        alt="RunTheWeb logo"
                        height={500}
                        width={500}
                    /> */}
                </Stack>

                {/* <ButtonGroup justified>
                    <Button>Launch App</Button>
                    <Button>Pixel War</Button>
                </ButtonGroup> */}
            </div>
        </>

    );
}
