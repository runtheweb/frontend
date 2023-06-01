import type { AppProps } from 'next/app';

import { CustomProvider } from 'rsuite';
import * as wagmi from "wagmi";
import * as web3modal from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import '@/styles/globals.css';
import NetworkProvider from '@/components/NetworkProvider';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <CustomProvider theme="dark">
            <NetworkProvider>
                <Component {...pageProps} />
            </NetworkProvider>
        </CustomProvider>
    );
}
