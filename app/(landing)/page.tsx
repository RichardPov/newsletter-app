"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Zap, Globe, Sparkles, Layout, Clock, Play, Star, Calendar } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center bg-white text-slate-900 w-full overflow-x-hidden font-sans">

      {/* 1. HERO SECTION */}
      <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 bg-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
          {/* Abstract blobs/shapes can go here */}
          <div className="absolute top-20 right-[-100px] w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-20 left-[-100px] w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 leading-[1.1] mb-8 max-w-5xl mx-auto">
            Clone your voice. <br />
            <span className="text-emerald-600">Automate your growth.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-slate-600 text-lg md:text-xl leading-relaxed mb-10">
            NewsWeave curates trending stories and automatically writes engaging newsletters, Twitter threads, and LinkedIn posts in your unique style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-8 rounded-full text-lg font-semibold shadow-xl shadow-emerald-100 transition-all hover:scale-105" asChild>
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
            <Button variant="ghost" className="h-14 px-8 rounded-full text-lg font-medium text-slate-600 hover:bg-slate-50" asChild>
              <Link href="#how-it-works" className="flex items-center gap-2">
                <Play className="h-5 w-5 fill-slate-600" /> See how it works
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white"></div>
              ))}
            </div>
            <div>Trusted by 10,000+ writers</div>
          </div>
        </div>
      </section>

      {/* 2. TIME SAVERS & AI GENERATOR (High-level Features) */}
      <section className="w-full py-20 bg-slate-50/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

            {/* Time Savers Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow flex flex-col items-start overflow-hidden relative">
              <div className="mb-8 max-w-sm relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">Time Savers</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Cut down on mundane tasks with bulk actions: duplicate, move, schedule multiple posts, assign tasks, and request approvals – all in a click.
                </p>
              </div>
              {/* Visual - Placeholder for now, later generated */}
              <div className="w-full aspect-[4/3] bg-slate-50 rounded-xl relative overflow-hidden border border-slate-100 shadow-inner mt-auto">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-50">
                  {/* If image exists, it shows, otherwise fallback */}
                  <Image
                    src="/images/time-savers.png"
                    alt="Bulk actions UI"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* AI Generator Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100/50 hover:shadow-md transition-shadow flex flex-col items-start overflow-hidden relative">
              <div className="mb-8 max-w-sm relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">AI Content Generator</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Our AI is your ultimate free social media assistant. Generate copies, images, and hashtags, or enhance your existing text.
                </p>
              </div>
              <div className="w-full aspect-[4/3] bg-indigo-50/30 rounded-xl relative overflow-hidden border border-indigo-50 shadow-inner mt-auto flex items-center justify-center">
                <Image
                  src="/images/ai-generator.png"
                  alt="AI Generator UI"
                  fill
                  className="object-contain p-8"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. AUTO-PUBLISHING (Calendar View) */}
      <section className="w-full py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">Auto-publishing</h2>
            <p className="text-slate-600 text-lg md:text-xl font-light">
              Manual publishing is for dinosaurs. NewsWeave automates the processes and handles them for you.
            </p>
          </div>

          <div className="w-full relative min-h-[400px] md:min-h-[500px] bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden flex items-center justify-center">
            <Image
              src="/images/auto-publishing.png"
              alt="Calendar Scheduling View"
              fill
              className="object-contain p-4 md:p-12"
            />
          </div>
        </div>
      </section>

      {/* 4. STATS BAR (Results) */}
      <section className="w-full py-16 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Stat 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4 tracking-tight">41%</div>
              <div className="text-lg md:text-xl font-medium text-blue-600 mb-2">less time spent on tasks</div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Our survey shows that NewsWeave users save up to 41% more time than teams without a social media management tool.
              </p>
            </div>
            {/* Stat 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4 tracking-tight">23h</div>
              <div className="text-lg md:text-xl font-medium text-blue-600 mb-2">freed up monthly per user</div>
              <p className="text-slate-500 text-sm leading-relaxed">
                On average, our users save over 23 hours per month thanks to our streamlined workflow processes.
              </p>
            </div>
            {/* Stat 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4 tracking-tight">€4,2k</div>
              <div className="text-lg md:text-xl font-medium text-blue-600 mb-2">saved monthly</div>
              <p className="text-slate-500 text-sm leading-relaxed">
                For an agency with a €500 daily rate and 3 social media specialists, our Standard plan saves approximately €4,200 monthly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI FOR MANAGERS (Brand Voice) - Purple Section */}
      <section className="w-full py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              AI made for social <br />
              <span className="text-violet-600">media managers.</span>
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              No more tabs, plugins, or copy-paste. NewsWeave AI covers your full content workflow. Built for social media teams around the world.
            </p>
            <div className="flex gap-4">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white h-12 px-8 rounded-lg shadow-lg shadow-violet-200" asChild>
                <Link href="/dashboard">I want to try ↗</Link>
              </Button>
              <Button variant="outline" className="h-12 px-8 rounded-lg border-violet-200 text-violet-700 hover:bg-violet-50">
                Learn more
              </Button>
            </div>
          </div>
          <div className="relative">
            {/* Visual Image */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-2 md:p-4 rotate-1 border border-white/50 backdrop-blur-sm">
              <Image
                src="/images/brand-voice.png"
                alt="Brand Voice AI Interface"
                width={600}
                height={400}
                className="rounded-lg w-full h-auto"
              />
            </div>
            {/* Decorative floating elements */}
            <div className="absolute -top-10 -right-10 bg-white p-3 rounded-lg shadow-lg animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-2 text-violet-600 font-bold text-sm">
                <Sparkles className="w-4 h-4" /> AI Content
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PERSONAS ("Tailored to your needs") */}
      <section className="w-full py-24 bg-rose-50/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6 leading-tight">
              AI-driven social media platform tailored to your needs.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Facet 1: Freelancers */}
            <div className="bg-transparent group hover:bg-white rounded-3xl p-6 transition-all duration-300">
              <div className="bg-[#FDAA78] aspect-square rounded-3xl mb-6 flex items-center justify-center p-8 relative overflow-hidden shadown-inner">
                <Image src="/images/persona-freelancer.png" alt="Freelancer Doodle" fill className="object-contain p-4 mix-blend-multiply opacity-90" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-3">Freelancers</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Multiple clients, one brain. We keep it together for you.
              </p>
              <Link href="#" className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                NewsWeave for Freelancers <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Facet 2: Brands */}
            <div className="bg-transparent group hover:bg-white rounded-3xl p-6 transition-all duration-300">
              <div className="bg-[#2ECC71] aspect-square rounded-3xl mb-6 flex items-center justify-center p-8 relative overflow-hidden shadown-inner">
                <Image src="/images/persona-brand.png" alt="Brand Doodle" fill className="object-contain p-4 mix-blend-multiply opacity-90" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-3">Brands</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Centralize collaboration and skip the endless email threads.
              </p>
              <Link href="#" className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                NewsWeave for Brands <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Facet 3: Agencies */}
            <div className="bg-transparent group hover:bg-white rounded-3xl p-6 transition-all duration-300">
              <div className="bg-[#FF90E8] aspect-square rounded-3xl mb-6 flex items-center justify-center p-8 relative overflow-hidden shadown-inner">
                <Image src="/images/persona-agency.png" alt="Agency Doodle" fill className="object-contain p-4 mix-blend-multiply opacity-90" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-3">Agencies</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Give your clients clarity, not chaos.
              </p>
              <Link href="#" className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                NewsWeave for Agencies <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Facet 4: Global Brands */}
            <div className="bg-transparent group hover:bg-white rounded-3xl p-6 transition-all duration-300">
              <div className="bg-[#8FAAFF] aspect-square rounded-3xl mb-6 flex items-center justify-center p-8 relative overflow-hidden shadown-inner">
                {/* Reusing brand doodle for now or separate one */}
                <Image src="/images/persona-brand.png" alt="Global Doodle" fill className="object-contain p-4 mix-blend-multiply opacity-90" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-3">Global Brands</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Keep your messaging aligned with Global Content Manager.
              </p>
              <Link href="#" className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                NewsWeave for Global <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full py-24 bg-blue-600 text-white text-center">
        <div className="container px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to start?</h2>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 h-16 px-10 rounded-full text-xl font-bold" asChild>
            <Link href="/dashboard">Try NewsWeave Free ↗</Link>
          </Button>
        </div>
      </section>

    </div>
  )
}
