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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedCategories.map((category) => {
                const isSubscribed = subscribedCategories.includes(category.id)
                const isLoading = loading === category.id

                return (
                    <Card
                        key={category.id}
                        className={cn(
                            "cursor-pointer transition-all hover:shadow-lg",
                            isSubscribed && "ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                        )}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className={cn(
                                    "p-3 rounded-lg",
                                    isSubscribed
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                )}>
                                    {getIcon(category.icon)}
                                </div>
                                {isSubscribed ? (
                                    <div className="flex gap-2">
                                        <Badge className="bg-emerald-500">
                                            <Check className="h-3 w-3 mr-1" />
                                            Active
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                            onClick={(e) => handleUnsubscribe(category.id, e)}
                                        >
                                            Unsubscribe
                                        </Button>
                                    </div>
                                ) : (
                                    isLoading && (
                                        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                                    )
                                )}
                            </div>
                            <CardTitle className="text-lg mt-3">{category.name}</CardTitle>
                            <CardDescription className="text-sm">
                                {category.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-1">
                                {category.feeds.slice(0, 3).map((feed, idx) => (
                                    <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                        {feed.name}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
