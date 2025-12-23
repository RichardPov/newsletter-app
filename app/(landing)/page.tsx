"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Zap, Globe, Sparkles, Layout, Clock, Play } from "lucide-react"
import { HeroAnimation } from "@/components/hero-animation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center bg-white text-slate-900 w-full overflow-x-hidden">

      {/* Hero Section - Quillbot Style: Centered, Clean, Green/White */}
      <section className="w-full pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 bg-white relative overflow-hidden">

        {/* Decorative Floating Elements - Enhanced Visibility */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
          {/* Top Left - 1 */}
          <div className="absolute top-[5%] left-[2%] md:left-[5%] lg:left-[10%] opacity-90 transform -rotate-12 animate-in fade-in zoom-in duration-1000 delay-100">
            <div className="bg-white border border-slate-200 p-2 rounded-lg shadow-lg w-28 hover:scale-105 transition-transform">
              <div className="h-2 w-12 bg-emerald-100 rounded mb-2"></div>
              <div className="h-2 w-full bg-slate-100 rounded mb-1"></div>
              <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
            </div>
          </div>

          {/* Top Left - 2 (New) */}
          <div className="absolute top-[20%] left-[8%] md:left-[15%] lg:left-[20%] opacity-80 transform rotate-6 animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="bg-white border border-blue-100 p-2 rounded-lg shadow w-24">
              <div className="h-8 w-8 bg-blue-50 rounded-full mb-2 mx-auto"></div>
              <div className="h-1.5 w-full bg-slate-100 rounded"></div>
            </div>
          </div>

          {/* Top Right - 1 */}
          <div className="absolute top-[10%] right-[2%] md:right-[5%] lg:right-[10%] opacity-95 transform rotate-12 animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl w-36">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 rounded-full bg-purple-100"></div>
                <div className="h-2 w-16 bg-slate-100 rounded"></div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded mb-1"></div>
              <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
            </div>
          </div>

          {/* Top Right - 2 (New) */}
          <div className="absolute top-[30%] right-[10%] md:right-[15%] lg:right-[22%] opacity-80 transform -rotate-3 animate-in fade-in zoom-in duration-1000 delay-400">
            <div className="bg-white border border-orange-100 p-2 rounded-lg shadow-sm w-32">
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-full bg-orange-50 rounded"></div>
                <div className="h-1.5 w-2/3 bg-orange-50 rounded"></div>
              </div>
            </div>
          </div>

          {/* Bottom Left - 1 */}
          <div className="absolute bottom-[25%] left-[5%] md:left-[8%] lg:left-[12%] opacity-85 transform rotate-6 animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-md w-40">
              <div className="flex justify-between items-center mb-2">
                <div className="h-2 w-10 bg-emerald-100 rounded"></div>
                <div className="h-2 w-6 bg-slate-50 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-50 rounded"></div>
                <div className="h-1.5 w-full bg-slate-50 rounded"></div>
              </div>
            </div>
          </div>

          {/* Bottom Right - 2 (New - Moved Up) */}
          <div className="absolute bottom-[15%] right-[15%] md:right-[20%] lg:right-[25%] opacity-60 transform rotate-45 animate-in fade-in zoom-in duration-1000 delay-700">
            <div className="h-12 w-12 border-2 border-dashed border-slate-200 rounded-lg"></div>
          </div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none text-slate-900 leading-tight mb-6">
              Never write a <br className="hidden md:inline" />
              <span className="text-emerald-500">social post from scratch again.</span>
            </h1>
            <p className="mx-auto max-w-[800px] text-slate-600 md:text-xl/relaxed lg:text-2xl/relaxed font-light mb-6">
              Select your favorite segments, let AI generate viral LinkedIn & Twitter posts from top articles, and schedule them to your planner in seconds.
            </p>
            <HeroAnimation />
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pt-10">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white h-14 px-8 rounded-full text-lg font-semibold shadow-lg shadow-emerald-200 transition-all hover:scale-105" asChild>
                <Link href="/dashboard">Start For Free</Link>
              </Button>
            </div>
          </div>

          {/* Trust/Stats Section */}
          <div className="mt-12 w-full max-w-4xl mx-auto border-y border-slate-100 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="flex flex-col items-center space-y-2 px-4">
                <h3 className="text-lg font-semibold text-slate-900">Join millions of users</h3>
                <p className="text-sm text-slate-500">Enhance your curation process</p>
              </div>
              <div className="flex flex-col items-center space-y-2 px-4 pt-8 md:pt-0">
                <h3 className="text-lg font-semibold text-slate-900">Get trusted results</h3>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <span>Rated 4.8</span>
                  <span className="text-emerald-500">★</span>
                  <span>on Trustpilot</span>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2 px-4 pt-8 md:pt-0">
                <h3 className="text-lg font-semibold text-slate-900">Boost your productivity</h3>
                <p className="text-sm text-slate-500">Save 15+ hours weekly</p>
              </div>
            </div>
          </div>

          {/* Abstract UI Mockup */}

        </div>
      </section>

      {/* Features Section - Green Accents, Clean Icons */}
      <section className="w-full py-20 bg-slate-50" id="features">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why writers love NewsWeave
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              We combine the speed of AI with the authenticity of your voice.
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="flex flex-col items-start space-y-4 p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 p-3 rounded-xl mb-2">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Instant Content Generation</h3>
              <p className="text-slate-600 leading-relaxed">
                Turn any article into a high-performing LinkedIn post or Twitter thread with one click. Choose from multiple tones and styles.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-start space-y-4 p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 p-3 rounded-xl mb-2">
                <Globe className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Curated Segments</h3>
              <p className="text-slate-600 leading-relaxed">
                No more RSS hunting. Select from 15+ professionally curated segments like Tech, Crypto, or Business to find the best stories.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-start space-y-4 p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 p-3 rounded-xl mb-2">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Social Autopilot</h3>
              <p className="text-slate-600 leading-relaxed">
                Generate Twitter threads and LinkedIn posts automatically from your curated news. Grow your audience on autopilot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section ("Why use...") - Reversed Colors (Green BG) */}
      <section className="w-full py-20 bg-emerald-900 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why use an AI social media generator?
            </h2>
          </div>
          <div className="grid gap-12 sm:grid-cols-3 max-w-6xl mx-auto text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-emerald-800/50 rounded-2xl shadow-sm mb-2 backdrop-blur-sm border border-emerald-800">
                <Sparkles className="h-10 w-10 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-white">Never run out of ideas</h3>
              <p className="text-emerald-100 leading-relaxed">
                Get a constant stream of trending topics from your selected segments, ready to be transformed into content.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-emerald-800/50 rounded-2xl shadow-sm mb-2 backdrop-blur-sm border border-emerald-800">
                <Layout className="h-10 w-10 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-white">Professional & Viral Styles</h3>
              <p className="text-emerald-100 leading-relaxed">
                Choose between professional insights, viral hooks, or storytelling modes for both LinkedIn and Twitter.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-emerald-800/50 rounded-2xl shadow-sm mb-2 backdrop-blur-sm border border-emerald-800">
                <Clock className="h-10 w-10 text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-white">Save time</h3>
              <p className="text-emerald-100 leading-relaxed">
                Cut your social media management time by 90%. Curate, generate, and plan in one seamless workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section ("For everyone...") */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              The AI social media tool for everyone
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Case 1 */}
            <div className="rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-emerald-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/images/startup-marketer.png"
                  alt="Indie Hacker working on laptop"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Indie Hacker</h3>
              <p className="text-slate-600">
                Build authority in your niche without spending hours writing updates manually.
              </p>
            </div>
            {/* Case 2 */}
            <div className="rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-emerald-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/images/club-organizer.png"
                  alt="Content Curator"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Content Curator</h3>
              <p className="text-slate-600">
                Turn your reading habit into a growing newsletter business.
              </p>
            </div>
            {/* Case 3 */}
            <div className="rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-emerald-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/images/solo-creator.png"
                  alt="Solo Founder"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Solo Founder</h3>
              <p className="text-slate-600">
                Build your personal brand on LinkedIn and Twitter while you sleep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How to use NewsWeave's AI social generator
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 border-t-2 border-dashed border-slate-200 z-0"></div>

            <div className="grid gap-8 md:grid-cols-3 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-white text-emerald-600 font-bold text-xl h-24 w-24 flex items-center justify-center rounded-full shadow-lg border-4 border-emerald-50 relative group transition-transform hover:scale-110">
                  <span className="text-3xl">1</span>
                  <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">Start</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4">Share settings</h3>
                <p className="text-slate-600 leading-relaxed max-w-xs">
                  Select the industry segments that matter to you. We curate the top news sources automatically.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-white text-emerald-600 font-bold text-xl h-24 w-24 flex items-center justify-center rounded-full shadow-lg border-4 border-emerald-50 relative group transition-transform hover:scale-110">
                  <span className="text-3xl">2</span>
                  <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">Process</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4">AI Drafting</h3>
                <p className="text-slate-600 leading-relaxed max-w-xs">
                  Pick an article and let AI generate optimized posts for LinkedIn (Professional, Story) and Twitter (Thread, Hook).
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-white text-emerald-600 font-bold text-xl h-24 w-24 flex items-center justify-center rounded-full shadow-lg border-4 border-emerald-50 relative group transition-transform hover:scale-110">
                  <span className="text-3xl">3</span>
                  <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">Publish</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4">Send & Grow</h3>
                <p className="text-slate-600 leading-relaxed max-w-xs">
                  Review your posts and add them directly to your planner. Your social calendar sorted in minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-full text-lg shadow-md" asChild>
              <Link href="/dashboard">Try social generator for free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              AI social media generator FAQs
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is an AI social media generator?</AccordionTrigger>
                <AccordionContent>
                  An AI social media generator creates professional LinkedIn posts and Twitter threads from curated news articles, saving you hours of writing time.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does it generate content?</AccordionTrigger>
                <AccordionContent>
                  It analyzes the context of your chosen article and applies proven social media frameworks (like hooks, storytelling, or threads) to create viral-ready content.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What are the main benefits?</AccordionTrigger>
                <AccordionContent>
                  It saves hours of manual work, ensures consistent schedule, maintains a professional quality, and helps you scale your content production without extra effort.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is NewsWeave free to use?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer a generous free tier for individuals. You can upgrade to a Pro plan for advanced analytics and more team seats.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="mt-12 text-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-full text-lg shadow-md" asChild>
              <Link href="/dashboard">Generate social posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-emerald-50 rounded-3xl p-12 lg:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl mb-6">
              Ready to 10x your social presence?
            </h2>
            <p className="text-lg text-emerald-800/80 mb-8 max-w-2xl mx-auto">
              Join 10,000+ curators who save 15 hours a week with NewsWeave.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-full text-lg shadow-md" asChild>
              <Link href="/dashboard">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
