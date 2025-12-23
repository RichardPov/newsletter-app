import { getCategories, getUserCategories } from "@/lib/category-actions"
import { CategorySelector } from "@/components/category-selector"

export const dynamic = "force-dynamic"

export default async function DiscoverPage() {
    const [categories, subscribedCategories] = await Promise.all([
        getCategories(),
        getUserCategories()
    ])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Discover Content</h1>
                <p className="text-muted-foreground">
                    Select categories you're interested in. We'll curate the best content sources for you.
                </p>
            </div>

            <div>
                <CategorySelector
                    categories={categories}
                    subscribedCategories={subscribedCategories}
                />
            </div>

            {subscribedCategories.length > 0 && (
                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Your Active Categories</h2>
                    <div className="flex flex-wrap gap-2">
                        {subscribedCategories.map(catId => {
                            const cat = categories.find(c => c.id === catId)
                            return cat ? (
                                <div key={catId} className="bg-emerald-100 dark:bg-emerald-900 px-3 py-1 rounded-full text-sm font-medium">
                                    {cat.name}
                                </div>
                            ) : null
                        })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Articles from these categories will appear in your Article Manager.
                    </p>
                </div>
            )}
        </div>
    )
}
