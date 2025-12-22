"use client"

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import { NewsletterArticleCard } from './newsletter-article-card'

interface NewsletterPreviewProps {
    newsletter: any
    articles: any[]
    onRemove: (articleId: string) => void
}

export function NewsletterPreview({ newsletter, articles, onRemove }: NewsletterPreviewProps) {
    const { setNodeRef } = useDroppable({
        id: 'newsletter-drop-zone'
    })

    return (
        <Card className="overflow-y-auto p-6" ref={setNodeRef}>
            <div className="mx-auto max-w-[600px] space-y-6">

                {/* Header */}
                <div
                    className="rounded-lg p-8 text-center"
                    style={{ backgroundColor: newsletter.headerColor || '#10b981' }}
                >
                    {newsletter.logoUrl && (
                        <img
                            src={newsletter.logoUrl}
                            alt="Logo"
                            className="mx-auto mb-4 max-w-[200px] h-auto"
                        />
                    )}
                    <h1 className="text-2xl font-bold text-white">{newsletter.title}</h1>
                </div>

                {/* Intro */}
                {newsletter.intro && (
                    <div
                        className="text-base leading-relaxed"
                        style={{ color: newsletter.textColor || '#1f2937' }}
                    >
                        {newsletter.intro}
                    </div>
                )}

                {/* Articles Drop Zone */}
                <div className="min-h-[300px] rounded-lg border-2 border-dashed border-slate-200 p-4">
                    {articles.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-slate-400 py-12">
                            <Mail className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-sm">Drag articles here from the left</p>
                        </div>
                    ) : (
                        <SortableContext items={articles.map(a => a.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4">
                                {articles.map((article, index) => (
                                    <div key={article.id} className="bg-white border rounded-lg p-4">
                                        <h3
                                            className="text-lg font-semibold mb-2"
                                            style={{ color: newsletter.textColor || '#1f2937' }}
                                        >
                                            {index + 1}. {article.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-3">{article.summary}</p>
                                        <a
                                            href={article.url}
                                            className="inline-block px-4 py-2 rounded text-sm font-medium text-white"
                                            style={{ backgroundColor: newsletter.headerColor || '#10b981' }}
                                        >
                                            Read More →
                                        </a>
                                        <button
                                            onClick={() => onRemove(article.id)}
                                            className="ml-2 text-red-500 text-xs hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    )}
                </div>

                {/* Outro */}
                {newsletter.outro && (
                    <div
                        className="text-base leading-relaxed border-t pt-6"
                        style={{ color: newsletter.textColor || '#1f2937' }}
                    >
                        {newsletter.outro}
                    </div>
                )}

                {/* Footer */}
                {newsletter.footerText && (
                    <div className="bg-slate-50 p-4 rounded text-center text-sm text-slate-600">
                        {newsletter.footerText}
                    </div>
                )}

            </div>
        </Card>
    )
}
