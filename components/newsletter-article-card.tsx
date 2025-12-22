"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { GripVertical, Star } from 'lucide-react'
import { Article } from '@prisma/client'

interface NewsletterArticleCardProps {
    article: Article & { feed?: any }
    isDragging?: boolean
}

export function NewsletterArticleCard({ article, isDragging }: NewsletterArticleCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: article.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-3 cursor-move hover:shadow-md transition-shadow"
        >
            <div className="flex items-start gap-2">
                <GripVertical className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2">{article.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">
                            {article.feed?.name || 'RSS'}
                        </span>
                        {article.viralScore && article.viralScore > 7 && (
                            <div className="flex items-center gap-0.5 text-amber-500">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="text-xs font-medium">{article.viralScore}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
