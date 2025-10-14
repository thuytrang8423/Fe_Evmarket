'use client'

export default function Template({ children }: { children: React.ReactNode }) {
  // No animation or transitions, just render children immediately
  return <>{children}</>
}
