const Brand = ({ light = false, className = '' }) => {
  return (
    <span className={`font-display text-2xl tracking-tight ${light ? 'text-paper' : 'text-ink'} ${className}`}>
      Health<span className="text-primary">Link</span>
    </span>
  )
}

export default Brand
