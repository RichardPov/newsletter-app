// Category definitions with curated RSS feeds
export interface CategoryFeed {
    name: string
    url: string
}

export interface Category {
    id: string
    name: string
    icon: string
    description: string
    feeds: CategoryFeed[]
}

export const CATEGORIES: Category[] = [
    {
        id: "technology",
        name: "Technology",
        icon: "Laptop",
        description: "Latest tech news, gadgets, and innovations",
        feeds: [
            { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
            { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
            { name: "Wired", url: "https://www.wired.com/feed/rss" }
        ]
    },
    {
        id: "fashion",
        name: "Fashion & Style",
        icon: "Sparkles",
        description: "Trends, runway shows, and style tips",
        feeds: [
            { name: "Vogue", url: "https://www.vogue.com/feed/rss" },
            { name: "Fashionista", url: "https://fashionista.com/feed" },
            { name: "Refinery29", url: "https://www.refinery29.com/rss.xml" }
        ]
    },
    {
        id: "crypto",
        name: "Cryptocurrency",
        icon: "Bitcoin",
        description: "Crypto news, blockchain, and Web3",
        feeds: [
            { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
            { name: "Decrypt", url: "https://decrypt.co/feed" },
            { name: "The Block", url: "https://www.theblock.co/rss.xml" }
        ]
    },
    {
        id: "business",
        name: "Business & Finance",
        icon: "TrendingUp",
        description: "Markets, startups, and economy",
        feeds: [
            { name: "Forbes", url: "https://www.forbes.com/real-time/feed2/" },
            { name: "Business Insider", url: "https://www.businessinsider.com/rss" },
            { name: "Entrepreneur", url: "https://www.entrepreneur.com/latest.rss" }
        ]
    },
    {
        id: "sports",
        name: "Sports",
        icon: "Trophy",
        description: "Game updates, analysis, and highlights",
        feeds: [
            { name: "ESPN", url: "https://www.espn.com/espn/rss/news" },
            { name: "Bleacher Report", url: "https://bleacherreport.com/articles/feed" },
            { name: "The Athletic", url: "https://theathletic.com/feeds/rss/" }
        ]
    },
    {
        id: "health",
        name: "Health & Wellness",
        icon: "Heart",
        description: "Fitness, nutrition, and mental health",
        feeds: [
            { name: "Healthline", url: "https://www.healthline.com/rss" },
            { name: "Well+Good", url: "https://www.wellandgood.com/feed/" },
            { name: "MindBodyGreen", url: "https://www.mindbodygreen.com/rss.xml" }
        ]
    },
    {
        id: "food",
        name: "Food & Cooking",
        icon: "UtensilsCrossed",
        description: "Recipes, restaurants, and culinary trends",
        feeds: [
            { name: "Bon Appétit", url: "https://www.bonappetit.com/feed/rss" },
            { name: "Food52", url: "https://food52.com/blog.rss" },
            { name: "Serious Eats", url: "https://www.seriouseats.com/feed" }
        ]
    },
    {
        id: "travel",
        name: "Travel",
        icon: "Plane",
        description: "Destinations, tips, and adventures",
        feeds: [
            { name: "Lonely Planet", url: "https://www.lonelyplanet.com/blog/feed/" },
            { name: "Travel + Leisure", url: "https://www.travelandleisure.com/syndication/feed" },
            { name: "Condé Nast Traveler", url: "https://www.cntraveler.com/feed/rss" }
        ]
    },
    {
        id: "entertainment",
        name: "Entertainment",
        icon: "Film",
        description: "Movies, TV, music, and celebrities",
        feeds: [
            { name: "Variety", url: "https://variety.com/feed/" },
            { name: "The Hollywood Reporter", url: "https://www.hollywoodreporter.com/feed/" },
            { name: "Billboard", url: "https://www.billboard.com/feed/" }
        ]
    },
    {
        id: "science",
        name: "Science",
        icon: "Microscope",
        description: "Research, discoveries, and space",
        feeds: [
            { name: "Science Daily", url: "https://www.sciencedaily.com/rss/all.xml" },
            { name: "Space.com", url: "https://www.space.com/feeds/all" },
            { name: "Phys.org", url: "https://phys.org/rss-feed/" }
        ]
    },
    {
        id: "politics",
        name: "Politics",
        icon: "Vote",
        description: "Political news and analysis",
        feeds: [
            { name: "Politico", url: "https://www.politico.com/rss/politics08.xml" },
            { name: "The Hill", url: "https://thehill.com/feed/" },
            { name: "CNN Politics", url: "http://rss.cnn.com/rss/cnn_allpolitics.rss" }
        ]
    },
    {
        id: "gaming",
        name: "Gaming",
        icon: "Gamepad2",
        description: "Video games, esports, and reviews",
        feeds: [
            { name: "IGN", url: "https://feeds.ign.com/ign/all" },
            { name: "Polygon", url: "https://www.polygon.com/rss/index.xml" },
            { name: "Kotaku", url: "https://kotaku.com/rss" }
        ]
    },
    {
        id: "lifestyle",
        name: "Lifestyle",
        icon: "Home",
        description: "Home, design, and everyday living",
        feeds: [
            { name: "Apartment Therapy", url: "https://www.apartmenttherapy.com/main.rss" },
            { name: "Design Milk", url: "https://design-milk.com/feed/" },
            { name: "Dwell", url: "https://www.dwell.com/rss" }
        ]
    },
    {
        id: "marketing",
        name: "Marketing & Ads",
        icon: "Megaphone",
        description: "Digital marketing and advertising trends",
        feeds: [
            { name: "Marketing Land", url: "https://marketingland.com/feed" },
            { name: "Adweek", url: "https://www.adweek.com/feed/" },
            { name: "Social Media Today", url: "https://www.socialmediatoday.com/rss.xml" }
        ]
    },
    {
        id: "design",
        name: "Design",
        icon: "Palette",
        description: "Graphic design, UX, and creativity",
        feeds: [
            { name: "Design Shack", url: "https://designshack.net/feed/" },
            { name: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/" },
            { name: "Creative Bloq", url: "https://www.creativebloq.com/feed" }
        ]
    },
    {
        id: "automotive",
        name: "Automotive",
        icon: "Car",
        description: "Cars, electric vehicles, and auto news",
        feeds: [
            { name: "Car and Driver", url: "https://www.caranddriver.com/rss/all.xml/" },
            { name: "Motor Trend", url: "https://www.motortrend.com/feed/" },
            { name: "Electrek", url: "https://electrek.co/feed/" }
        ]
    }
]

export function getCategoryById(id: string): Category | undefined {
    return CATEGORIES.find(cat => cat.id === id)
}

export function getCategoryNames(): string[] {
    return CATEGORIES.map(cat => cat.name)
}
