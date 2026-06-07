export default function Perp() {
  const url = import.meta.env.VITE_PERP_DEX_URL || 'https://dex.orderly.network'
  return (
    <div className="h-[calc(100vh-64px)] w-full -mx-4 md:-mx-6 -mt-4 md:-mt-6">
      <iframe
        src={url}
        className="w-full h-full border-0"
        allow="clipboard-write"
        title="Asahi Perp"
      />
    </div>
  )
}
