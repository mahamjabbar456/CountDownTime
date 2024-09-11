"use client";  // Enables client-side rendering for this component
import { useState, useRef, useEffect, ChangeEvent } from "react"; // Import React hooks and types
import { Input } from "./ui/input"; // Import custom Input component
import { Button } from "./ui/button"; // Import custom Button component

const CountDown = () => {
    // State to manage the duration input
    const [duration, setDuration] = useState<number | string>(" ");
     // State to manage the countdown timer value
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Function
    const handleSetDuration = (): void => {
        if (typeof duration === "number" && duration > 0) {
            setTimeLeft(duration);
            setIsActive(false);
            setIsPaused(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }

    const handleStart = (): void => {
        if (timeLeft > 0) {
            setIsActive(true);
            setIsPaused(false);
        }
    };

    const handlePause = (): void => {
        if (isActive) {
            setIsPaused(true);
            setIsActive(false);
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }

    const handleReset = (): void => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(typeof duration === 'number' ? duration : 0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }

    // Use Effect for countdown Logic

    useEffect(() => {
        if (isActive && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prevTime - 1;
                })
            }, 1000);
        }
        return (() => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        })
    }, [isActive, isPaused])

    // format time
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    // handleDuration change
    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setDuration(Number(e.target.value) || "");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-emerald-300 ">
            {/* Timer box container */}
            <div className="bg-gray-900  text-white p-8 rounded-lg shadow-lg w-[400px] max-w-full">
                {/* Title of the countdown timer */}
                <h1 className="font-bold text-2xl mb-4 text-white/40 text-center">
                    CountDown Timer
                </h1>
                {/* Input and set button container */}
                <div className="flex items-center mb-6">
                    <Input type="number" id="duration" placeholder="Enter duration in seconds" value={duration} onChange={handleDurationChange} className="flex-1 mr-4 rounded-md border-white text-white/40 font-medium" />
                    <Button onClick={handleSetDuration} variant="outline" className=" text-white/40">
                        Set
                    </Button>
                </div>
                {/* Display the formatted time left */}
                <div className="text-6xl font-bold text-center text-white/40 mb-8">
                        {formatTime(timeLeft)}
                </div>
                {/* Buttons to start, pause, and reset the timer */}
                <div className="flex justify-center gap-4">
                    <Button onClick={handleStart} variant="outline" className="text-white/40">
                        {isPaused?"Resume":"Start"}
                    </Button>
                    <Button onClick={handlePause} variant="outline" className="text-white/40">
                        Pause
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="text-white/40">
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CountDown
