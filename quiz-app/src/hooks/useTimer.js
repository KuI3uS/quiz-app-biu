import { useEffect, useRef, useState } from 'react';

export default function useTimer(initialTime, onFinish) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const timerRef = useRef(null);

    const start = (time) => {
        clearInterval(timerRef.current);
        setTimeLeft(time);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    onFinish?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        start(initialTime);
        return () => clearInterval(timerRef.current);
    }, [initialTime]);

    const reset = (newTime) => {
        start(newTime);
    };

    const stop = () => {
        clearInterval(timerRef.current);
    };

    return { timeLeft, reset, stop };
}