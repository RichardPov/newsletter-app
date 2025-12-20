export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col">
            <header className="py-6 px-4 md:px-8 border-b border-slate-100 flex justify-center">
                <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <span className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg">N</span>
                    <span className="text-slate-900">NewsWeave</span>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
