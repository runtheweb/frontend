import React from "react";

export function DecreasingTimer({ secondsFrom, onExpired, ...props}: { secondsFrom: number, onExpired?: () => any }) {
    const [remainingSeconds, setRemainingSeconds] = React.useState(secondsFrom);
    const [onExpiriedCalled, setOnExpiredCalled] = React.useState(false);

    if (remainingSeconds !== 0) {
        setTimeout(() => {
            setRemainingSeconds(remainingSeconds - 1)
        }, 1000)
    } else if (!onExpiriedCalled) {
        onExpired?.()
        setOnExpiredCalled(true);
    }
    return <>{Math.floor(remainingSeconds / 60)} mins</>
}
