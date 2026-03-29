import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar, 0.10 0 0))',
                    foreground: 'oklch(var(--sidebar-foreground, 0.95 0 0))',
                    primary: 'oklch(var(--sidebar-primary, 0.72 0.22 55))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground, 0.07 0 0))',
                    accent: 'oklch(var(--sidebar-accent, 0.14 0 0))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground, 0.95 0 0))',
                    border: 'oklch(var(--sidebar-border, 0.20 0 0))',
                    ring: 'oklch(var(--sidebar-ring, 0.72 0.22 55))'
                },
                'nfs-cyan': 'oklch(var(--nfs-cyan))',
                'nfs-orange': 'oklch(var(--nfs-orange))',
                'nfs-purple': 'oklch(var(--nfs-purple))',
                'nfs-yellow': 'oklch(var(--nfs-yellow))',
                'nfs-red': 'oklch(var(--nfs-red))',
                'boost-yellow': 'oklch(var(--boost-yellow))',
                'racing-blue': 'oklch(var(--racing-blue))',
                'racing-purple': 'oklch(var(--racing-purple))',
                'racing-pink': 'oklch(var(--racing-pink))',
                'track-green': 'oklch(var(--track-green))'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 4px)',
                '2xl': 'calc(var(--radius) + 8px)',
                '3xl': 'calc(var(--radius) + 12px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                'neon-cyan': '0 0 20px rgba(0,220,255,0.5)',
                'neon-orange': '0 0 20px rgba(255,140,0,0.5)',
                'neon-purple': '0 0 20px rgba(180,0,255,0.5)',
                'neon-yellow': '0 0 20px rgba(255,220,0,0.5)'
            },
            fontFamily: {
                sans: ['Satoshi', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                display: ['Bricolage Grotesque', 'Satoshi', 'system-ui', 'sans-serif']
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'bounce-slow': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'bounce-slow': 'bounce-slow 2s ease-in-out infinite'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
