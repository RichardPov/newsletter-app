"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HexColorPicker } from 'react-colorful'
import { Upload, Palette } from 'lucide-react'
import { updateNewsletter, uploadNewsletterLogo } from '@/lib/newsletter-actions'
import { toast } from 'sonner'

interface NewsletterCustomizerProps {
    newsletterId: string
    newsletter: any
}

export function NewsletterCustomizer({ newsletterId, newsletter }: NewsletterCustomizerProps) {
    const [headerColor, setHeaderColor] = useState(newsletter.headerColor || '#10b981')
    const [textColor, setTextColor] = useState(newsletter.textColor || '#1f2937')
    const [footerText, setFooterText] = useState(newsletter.footerText || '')
    const [showHeaderPicker, setShowHeaderPicker] = useState(false)
    const [showTextPicker, setShowTextPicker] = useState(false)
    const [uploading, setUploading] = useState(false)

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('logo', file)

            const { logoUrl } = await uploadNewsletterLogo(formData)
            await updateNewsletter(newsletterId, { logoUrl })

            toast.success('Logo uploaded!')
        } catch (error) {
            toast.error('Failed to upload logo')
        } finally {
            setUploading(false)
        }
    }

    const handleSaveColors = async () => {
        try {
            await updateNewsletter(newsletterId, {
                headerColor,
                textColor
            })
            toast.success('Colors updated!')
        } catch (error) {
            toast.error('Failed to update colors')
        }
    }

    const handleSaveFooter = async () => {
        try {
            await updateNewsletter(newsletterId, { footerText })
            toast.success('Footer updated!')
        } catch (error) {
            toast.error('Failed to update footer')
        }
    }

    return (
        <Card className="overflow-y-auto">
            <CardHeader>
                <CardTitle className="text-sm font-semibold">Customize</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Logo Upload */}
                <div className="space-y-2">
                    <Label htmlFor="logo" className="text-xs font-medium">Logo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={uploading}
                            className="text-xs"
                        />
                        <Button size="icon" variant="outline" disabled={uploading}>
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>
                    {newsletter.logoUrl && (
                        <img
                            src={newsletter.logoUrl}
                            alt="Logo"
                            className="w-32 h-auto rounded border"
                        />
                    )}
                </div>

                {/* Header Color */}
                <div className="space-y-2">
                    <Label className="text-xs font-medium">Header Color</Label>
                    <div className="flex gap-2 items-center">
                        <div
                            className="w-10 h-10 rounded border cursor-pointer"
                            style={{ backgroundColor: headerColor }}
                            onClick={() => setShowHeaderPicker(!showHeaderPicker)}
                        />
                        <Input
                            value={headerColor}
                            onChange={(e) => setHeaderColor(e.target.value)}
                            className="text-xs font-mono"
                        />
                    </div>
                    {showHeaderPicker && (
                        <div className="mt-2">
                            <HexColorPicker color={headerColor} onChange={setHeaderColor} />
                        </div>
                    )}
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                    <Label className="text-xs font-medium">Text Color</Label>
                    <div className="flex gap-2 items-center">
                        <div
                            className="w-10 h-10 rounded border cursor-pointer"
                            style={{ backgroundColor: textColor }}
                            onClick={() => setShowTextPicker(!showTextPicker)}
                        />
                        <Input
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="text-xs font-mono"
                        />
                    </div>
                    {showTextPicker && (
                        <div className="mt-2">
                            <HexColorPicker color={textColor} onChange={setTextColor} />
                        </div>
                    )}
                </div>

                <Button onClick={handleSaveColors} className="w-full" size="sm">
                    <Palette className="mr-2 h-4 w-4" />
                    Apply Colors
                </Button>

                {/* Footer Text */}
                <div className="space-y-2">
                    <Label htmlFor="footer" className="text-xs font-medium">Footer Text</Label>
                    <Textarea
                        id="footer"
                        value={footerText}
                        onChange={(e) => setFooterText(e.target.value)}
                        placeholder="© 2024 Your Company. Unsubscribe"
                        rows={3}
                        className="text-xs"
                    />
                    <Button onClick={handleSaveFooter} className="w-full" size="sm" variant="outline">
                        Save Footer
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}
