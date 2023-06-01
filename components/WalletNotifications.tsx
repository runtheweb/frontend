import { Notification, useToaster} from "rsuite";

import * as wagmi from "wagmi";


enum TXState {
    AwaitWalletConfirmation,
    WalletConfirmationDeclined,
    Broadcasting,
    EVMError,
    Success,
    Done
}

const stalkeredHashes: { [k: string]: TXState } = {};


const WalletNotification = ({type, header, content}: {
    type: string,
    header: string,
    content: string
}) => (
    <Notification type={type} header={header} closable>
        {content}
    </Notification>
);

export const NotificationAwaitWalletConfirmation
    = <WalletNotification
        type="info"
        header="Confirm broadcasting"
        content="Please, confirm TX in your wallet."
    />;

export const NotificationTXBroadcasting
    = <WalletNotification
        type="info"
        header="Broadcasting TX"
        content="TX is broadcasting..."
    />;

export const NotificationTXSuccessfullyBroadcasted
    = <WalletNotification
        type="success"
        header="TX broadcasted!"
        content="Done!"
    />;


export const NotificationTXRevertError = ({message, ...props}: {
    message: string
}) => {
    return (
        <WalletNotification
            type="error"
            header="Contract will revert!"
            content={message.charAt(0).toUpperCase() + message.slice(1)}
        />
    );
}



export const WalletTXSuccessfullyBroadcasted = ({...props}) => {
    return (
        <Notification type="success" header="TX boradcasted" closable>
            Please, confirm the transaction in your wallet
        </Notification>
    );
}

export function withSigningHook(
    data: any,
    toaster: ReturnType<typeof useToaster>
): any {
    if (data !== null && data !== undefined) {
        data["onSuccess"] = (data: any, variables: any, context: any) => {
            toaster.push(NotificationTXBroadcasting, { placement: "topStart" })
        }
    }
    return data;
}

export function withWaiterHook(
    data: any,
    toaster: ReturnType<typeof useToaster>
): any {
    if (data !== null && data !== undefined) {
        data["onSuccess"] = (data: any) => {
            toaster.push(NotificationTXSuccessfullyBroadcasted, { placement: "topStart" })
            setTimeout(() => {
                toaster.clear()
            }, 3000)
        }
    }
    return data;
}

export function wrapWriteCallback(
    callback: Function | undefined,
    preparation: { error?: { reason?: string } | null, isError: boolean },
    toaster: ReturnType<typeof useToaster>,
): Function {
    return () => {
        preparation.refetch()
        if (preparation.isError) {

            toaster.push(<NotificationTXRevertError message={preparation.error?.reason ?? ""} />, { placement: "topStart" })
            setTimeout(() => {
                toaster.clear()
            }, 10*1000)
        }
        else {
            toaster.push(NotificationAwaitWalletConfirmation, { placement: "topStart"})
            return callback?.()
        }

    }
}
