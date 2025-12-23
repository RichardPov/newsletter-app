"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { subscribeToCategory, unsubscribeFromCategory } from "@/lib/category-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import * as Icons from "lucide-react"

interface Category {
    id: string
    name: string
    icon: string
    description: string
    feeds: { name: string; url: string }[]
}

interface CategorySelectorProps {
    categories: Category[]
    subscribedCategories: string[]
}

export function CategorySelector({ categories, subscribedCategories: initialSubscribed }: CategorySelectorProps) {
    const [subscribedCategories, setSubscribedCategories] = useState<string[]>(initialSubscribed)
    const [loading, setLoading] = useState<string | null>(null)
    const router = useRouter()

    const handleUnsubscribe = async (categoryId: string, e: React.MouseEvent) => {
        e.stopPropagation()

        const category = categories.find(c => c.id === categoryId)
        if (!confirm(`Unsubscribe from ${category?.name}? This will remove all associated feeds.`)) return

        setLoading(categoryId)
        try {
            const result = await unsubscribeFromCategory(categoryId)
            setSubscribedCategories(subscribedCategories.filter(id => id !== categoryId))
            toast.success(`Unsubscribed from ${category?.name}`)
            router.refresh()
        } catch (error) {
            toast.error("Failed to unsubscribe")
        } finally {
            setLoading(null)
        }
    }

    const handleCategoryClick = async (categoryId: string) => {
        const isSubscribed = subscribedCategories.includes(categoryId)

        if (isSubscribed) {
            return // Don't re-subscribe
        }

        setLoading(categoryId)

        try {
            const result = await subscribeToCategory(categoryId)

            if (result.success) {
                setSubscribedCategories([...subscribedCategories, categoryId])
                toast.success(`Subscribed to ${result.category}! ${result.feedsAdded} feeds added.`)
                router.refresh()
            } else {
                toast.error(result.error || "Failed to subscribe")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(null)
        }
    }

    const getIcon = (iconName: string) => {
        const Icon = (Icons as any)[iconName]
        return Icon ? <Icon className="h-6 w-6" /> : <Icons.Circle className="h-6 w-6" />
    }

    // Sort categories: subscribed first, then alphabetically
    const sortedCategories = [...categories].sort((a, b) => {
        const aSubscribed = subscribedCategories.includes(a.id)
        const bSubscribed = subscribedCategories.includes(b.id)

        // Subscribed categories come first
        if (aSubscribed && !bSubscribed) return -1
        if (!aSubscribed && bSubscribed) return 1

        // Within each group, sort alphabetically
        return a.name.localeCompare(b.name)
    })

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedCategories.map((category) => {
                const isSubscribed = subscribedCategories.includes(category.id)
                const isLoading = loading === category.id

                return (
                    <Card
                        key={category.id}
                        className={cn(
                            "relative flex flex-col transition-all duration-300 hover:shadow-xl border-2",
                            isSubscribed
                                ? "border-emerald-500/50 bg-emerald-50/10 dark:bsg-emerald-950/10"
                                : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                        )}
                        onClick={() => !isSubscribed && handleCategoryClick(category.id)}
                    >
                        {/* Active Label - Top Right */}
                        {isSubscribed && (
                            <div className="absolute top-3 right-3 z-10">
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 shadow-sm">
                                    <Check className="h-3 w-3 mr-1" />
                                    Active
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="flex-1 pb-4">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                                isSubscribed
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    getIcon(category.icon)
                                )}
                            </div>

                            <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                            <CardDescription className="line-clamp-2 mt-2 leading-relaxed">
                                {category.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-2">
                            {/* Feeds Preview */}
                            <div className="flex flex-wrap gap-2">
                                {category.feeds.slice(0, 3).map((feed, idx) => (
                                    <span
                                        key={idx}
                                        className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground bg-muted/50 px-2 py-1 rounded-md"
                                    >
                                        {feed.name}
                                    </span>
                                ))}
                            </div>
                        </CardContent>

                        <CardFooter className="pt-4 mt-auto border-t bg-muted/5">
                            {isSubscribed ? (
                                <Button
                                    variant="ghost"
                                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                    onClick={(e) => handleUnsubscribe(category.id, e)}
                                    disabled={!!loading}
                                >
                                    Unsubscribe
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full hover:border-emerald-500 hover:text-emerald-600"
                                    onClick={() => handleCategoryClick(category.id)}
                                    disabled={!!loading}
                                >
                                    Subscribe
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
