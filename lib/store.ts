import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Article {
    id: string
    title: string
    source: string
    date: string
    url: string
    summary: string
    viralScore: number
    keyTakeaways: string[]
    category: 'Tech' | 'Marketing' | 'Business'
}

export interface RSSFeed {
    id: string
    name: string
    url: string
    active: boolean
}

export interface UserTone {
    name: string
    description: string
    style: 'formal' | 'casual' | 'sarcastic' | 'technical'
    keywords: string[]
}

interface AppState {
    feeds: RSSFeed[]
    articles: Article[]
    toneProfile: UserTone | null

    addFeed: (feed: RSSFeed) => void
    removeFeed: (id: string) => void
    setToneProfile: (profile: UserTone) => void
    setArticles: (articles: Article[]) => void
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            feeds: [
                { id: '1', name: 'TechCrunch', url: 'https://techcrunch.com/feed', active: true },
                { id: '2', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', active: true },
            ],
            articles: [],
            toneProfile: null,

            addFeed: (feed) => set((state) => ({ feeds: [...state.feeds, feed] })),
            removeFeed: (id) => set((state) => ({ feeds: state.feeds.filter((f) => f.id !== id) })),
            setToneProfile: (profile) => set({ toneProfile: profile }),
            setArticles: (articles) => set({ articles }),
        }),
        {
            name: 'newsweave-storage',
        }
    )
)
