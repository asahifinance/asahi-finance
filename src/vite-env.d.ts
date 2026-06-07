/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_REOWN_PROJECT_ID: string
  readonly VITE_1INCH_API_KEY: string
  readonly VITE_FEE_WALLET: string
  readonly VITE_PERP_DEX_URL: string
  readonly VITE_SOCIAL_TWITTER: string
  readonly VITE_SOCIAL_DISCORD: string
  readonly VITE_SOCIAL_MEDIUM: string
  readonly VITE_SOCIAL_TIKTOK: string
  readonly VITE_SOCIAL_INSTAGRAM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
