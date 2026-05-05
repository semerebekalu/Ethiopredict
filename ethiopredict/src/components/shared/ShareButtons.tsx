'use client'

interface ShareButtonsProps {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(`${title} — EthioPredict`)

  return (
    <div className="flex items-center gap-2 mt-3">
      <span className="text-[#555555] text-[0.65rem] uppercase tracking-wider">Share:</span>
      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 bg-[#229ED9] text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full hover:opacity-90 transition-opacity"
        aria-label="Share on Telegram"
      >
        ✈️ Telegram
      </a>
      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${text}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 bg-[#25D366] text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full hover:opacity-90 transition-opacity"
        aria-label="Share on WhatsApp"
      >
        📱 WhatsApp
      </a>
      {/* Copy link */}
      <button
        onClick={() => { navigator.clipboard.writeText(url); }}
        className="flex items-center gap-1 bg-[#1a1a1a] border border-[#333333] text-[#888888] text-[0.65rem] font-bold px-2.5 py-1 rounded-full hover:border-[#00E676] hover:text-[#00E676] transition-colors"
        aria-label="Copy link"
      >
        🔗 Copy
      </button>
    </div>
  )
}
