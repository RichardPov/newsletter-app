"use client"

import { useState, useEffect } from "react"
import { Check, Plus, Rss } from "lucide-react"
import { cn } from "@/lib/utils"

const FEEDS = [
    { name: "The Verge", color: "bg-orange-500" },
    { name: "TechCrunch", color: "bg-green-500" },
    { name: "Wired", color: "bg-black" },
]

export function HeroAnimation() {
    const [selectedIndices, setSelectedIndices] = useState<number[]>([])

    useEffect(() => {
        const sequence = async () => {
            // Reset
            setSelectedIndices([])
            await new Promise(r => setTimeout(r, 1000))

            // Select 1
            setSelectedIndices([0])
            await new Promise(r => setTimeout(r, 800))

            // Select 2
            setSelectedIndices([0, 1])
            await new Promise(r => setTimeout(r, 800))

            // Select 3
            setSelectedIndices([0, 1, 2])
            await new Promise(r => setTimeout(r, 2000))

            // Loop
            sequence()
        }

        sequence()

        return () => { } // Cleanup if needed, though recursive promise chain is hard to cancel simply. 
        // For a cleaner loop in useEffect:
    }, [])

    // Better implementation of the loop to be safe with unmounting variables
    useEffect(() => {
        let timeout: NodeJS.Timeout
        let step = 0

        const runStep = () => {
            if (step === 0) {
                setSelectedIndices([])
                timeout = setTimeout(() => { step++; runStep() }, 1000)
            } else if (step === 1) {
                setSelectedIndices([0])
                timeout = setTimeout(() => { step++; runStep() }, 800)
            } else if (step === 2) {
                setSelectedIndices([0, 1])
                timeout = setTimeout(() => { step++; runStep() }, 800)
            } else if (step === 3) {
                setSelectedIndices([0, 1, 2])
                timeout = setTimeout(() => { step = 0; runStep() }, 3000)
            }
        }

        runStep()

        return () => clearTimeout(timeout)
    }, [])

    return (
        <div className="flex flex-wrap justify-center gap-3">
            {FEEDS.map((feed, index) => {
                const isSelected = selectedIndices.includes(index)

                return (
                    <div
                        key={feed.name}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ease-in-out cursor-default select-none",
                            isSelected
                                ? "bg-slate-900 border-slate-900 text-white shadow-md scale-105"
                                : "bg-white border-slate-200 text-slate-500 shadow-sm"
                        )}
                    >
                        <div className={cn("w-2 h-2 rounded-full", feed.color)} />
                        <span className="font-medium text-sm">{feed.name}</span>
                        <div className="ml-1">
                            {isSelected ? (
                                <Check className="h-3.5 w-3.5 animate-in zoom-in duration-300" />
                            ) : (
                                <Plus className="h-3.5 w-3.5 opacity-50" />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
