import React from 'react'
import Link from 'next/link'
const page = () => {
  return (
    <section
      style={{
        minHeight: '100dvh',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 8vw, 96px) 0',
        overflow: 'hidden',
        background:
          'radial-gradient(1200px 500px at 10% -10%, color-mix(in oklab, var(--chart-2) 20%, transparent), transparent 60%), radial-gradient(1200px 500px at 110% 10%, color-mix(in oklab, var(--chart-3) 22%, transparent), transparent 60%), linear-gradient(180deg, var(--background) 0%, var(--background) 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 650,
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
          }}
        >
          <h1
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              margin: 0,
              fontSize: 'clamp(96px, 22vw, 200px)',
              backgroundImage:
                'linear-gradient(135deg, var(--chart-1) 0%, var(--chart-2) 30%, var(--chart-3) 65%, var(--chart-4) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              textShadow: '0 10px 30px rgba(0,0,0,0.35)',
            }}
          >
            4 0 4
          </h1>

          <h2
            style={{
              margin: '10px 0 0 0',
              fontSize: 'clamp(20px, 3.2vw, 28px)',
              fontWeight: 700,
              color: 'var(--foreground)',
            }}
          >
            This page seems to have slipped through a time portal.
          </h2>

          <p
            style={{
              margin: '6px 0 2px 0',
              color: 'color-mix(in oklab, var(--foreground) 78%, transparent)',
              fontSize: 'clamp(14px, 2.2vw, 16px)',
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            We apologize for any disruption to the space-time continuum. Feel
            free to journey back to our homepage.
          </p>

          <Link
            href={'/'}
            style={{
              display: 'inline-block',
              marginTop: 12,
              padding: '12px 18px',
              borderRadius: 12,
              background:
                'linear-gradient(135deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 70%, var(--chart-2)) 100%)',
              color: 'var(--primary-foreground)',
              textDecoration: 'none',
              fontWeight: 700,
              boxShadow:
                '0 10px 25px color-mix(in oklab, var(--primary) 25%, transparent), 0 4px 10px color-mix(in oklab, var(--chart-2) 22%, transparent)',
              transform: 'translateZ(0)',
            }}
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </section>
  )
}
export default page
