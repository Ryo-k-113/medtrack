import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			surface: 'hsl(var(--surface))',

  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},

				status: {
					normal: {
						DEFAULT: 'hsl(var(--status-normal))',
						foreground: 'hsl(var(--status-normal-foreground))',
					},
					limited: {
						DEFAULT: 'hsl(var(--status-limited))',
						foreground: 'hsl(var(--status-limited-foreground))',
					},
					stop: {
						DEFAULT: 'hsl(var(--status-stop))',
						foreground: 'hsl(var(--status-stop-foreground))',
					},
					discontinued: {
						DEFAULT: 'hsl(var(--status-discontinued))',
						foreground: 'hsl(var(--status-discontinued-foreground))',
					},
					transfer: {
						DEFAULT: 'hsl(var(--status-transfer))',
						foreground: 'hsl(var(--status-transfer-foreground))',
					},
				},
				tag: {
  				brand: {
						DEFAULT: 'hsl(var(--brand))',
						foreground: 'hsl(var(--brand-foreground))'
					},
  				generic: {
						DEFAULT: 'hsl(var(--generic))',
						foreground: 'hsl(var(--generic-foreground))'
					},
  			},

  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {

  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
