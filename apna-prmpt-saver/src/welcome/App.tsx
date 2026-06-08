import React, { useState } from 'react'
import { Zap, Search, FolderOpen, Copy, Star, BarChart2, ArrowRight, Check } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StoreProvider } from '../store'
import '../index.css'

const FEATURES = [
  { icon: Copy, title: 'One-Click Copy', desc: 'Copy any prompt instantly with a single click' },
  { icon: Search, title: 'Instant Search', desc: 'Fuzzy search across all your prompts' },
  { icon: FolderOpen, title: 'Smart Folders', desc: 'Organize prompts into colorful folders' },
  { icon: Star, title: 'Favorites', desc: 'Star your best prompts for quick access' },
  { icon: BarChart2, title: 'Analytics', desc: 'Track your usage and most-used prompts' },
  { icon: Zap, title: 'AI Models', desc: 'Tag prompts by ChatGPT, Claude, Gemini & more' },
]

const STEPS = [
  { title: 'Welcome', subtitle: 'Your AI prompt manager' },
  { title: 'Features', subtitle: 'What you can do' },
  { title: "You're ready!", subtitle: 'Start saving prompts' },
]

function WelcomeApp() {
  const [step, setStep] = useState(0)

  const openDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') })
    } else {
      window.location.href = 'dashboard.html'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-brand-600 text-white' : i === step ? 'bg-brand-600/20 text-brand-300 border-2 border-brand-500' : 'bg-white/10 text-white/30'}`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-0.5 rounded-full transition-colors ${i < step ? 'bg-brand-600' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="animate-fade-in">
          {step === 0 && (
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl shadow-brand-500/30">
                <Zap size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-3">Apna PromptVault</h1>
                <p className="text-lg text-white/50 max-w-sm leading-relaxed">
                  The premium prompt management system for AI power users
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <div className="text-xs text-white/30 text-center">Trusted by AI developers, marketers & creators</div>
              </div>
              <Button onClick={() => setStep(1)} size="lg" className="mt-2">
                Get Started <ArrowRight size={16} />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Everything you need</h2>
                <p className="text-white/40 text-sm">Powerful features for daily AI workflow</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FEATURES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white/3 border border-white/8 rounded-xl p-4 flex flex-col gap-2.5 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center">
                      <Icon size={15} className="text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-white/40 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)} className="flex-1">Continue <ArrowRight size={14} /></Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Check size={28} className="text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                  Start saving prompts by clicking the extension icon or pressing <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono">Ctrl+Shift+P</kbd>
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button onClick={openDashboard} size="lg">
                  Open Dashboard <ArrowRight size={16} />
                </Button>
                <Button variant="ghost" onClick={() => window.close()}>Maybe Later</Button>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-xl p-4 w-full text-left">
                <p className="text-xs font-medium text-white/70 mb-2">Quick Tips:</p>
                <ul className="flex flex-col gap-1">
                  {[
                    'Right-click any text → "Save as Prompt"',
                    'Use Ctrl+Shift+P to open instantly',
                    'Install on ChatGPT, Claude & Gemini for inline prompts',
                  ].map(tip => (
                    <li key={tip} className="flex items-start gap-2 text-xs text-white/40">
                      <span className="text-brand-400 mt-0.5">•</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Welcome() {
  return (
    <StoreProvider>
      <WelcomeApp />
    </StoreProvider>
  )
}
