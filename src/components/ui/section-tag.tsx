interface SectionTagProps {
  children: React.ReactNode
}

export default function SectionTag({ children }: SectionTagProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/[0.07] px-3.5 py-1.5 mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
      <span className="font-mono text-[11px] text-[#B8941F] tracking-[0.14em] uppercase">
        {children}
      </span>
    </div>
  )
}
