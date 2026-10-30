export default function Wordmark({ light = false, className = '' }) {
  const tone = light ? 'text-paper' : 'text-ink'
  return (
    <span className={`font-display text-2xl tracking-tight ${tone} ${className}`}>
      Health<span className="text-primary">Link</span>
    </span>
  )
}
