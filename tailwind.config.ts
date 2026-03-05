import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			teal: {
  				'50': '#E8ECF4',
  				'100': '#D1D9E9',
  				'200': '#A3B3D3',
  				'300': '#758DBD',
  				'400': '#4767A7',
  				'500': '#28437b',
  				'600': '#203662',
  				'700': '#18284A',
  				'800': '#101B31',
  				'900': '#080D19',
  				DEFAULT: '#28437b'
  			},
  			sand: {
  				'50': '#ffffff',
  				'100': '#FAFAFA',
  				'200': '#F5F5F5',
  				'300': '#E8E8E8',
  				'400': '#D1D2D3',
  				'500': '#979a98',
  				'600': '#686668',
  				'700': '#4a4a4a',
  				'800': '#2a2a2a',
  				'900': '#010101',
  				DEFAULT: '#ffffff'
  			},
  			orange: {
  				'50': '#FDEDE9',
  				'100': '#FBDAD3',
  				'200': '#F7B5A7',
  				'300': '#F3907C',
  				'400': '#F06B50',
  				'500': '#f05024',
  				'600': '#C0401D',
  				'700': '#903016',
  				'800': '#60200F',
  				'900': '#301007',
  				DEFAULT: '#f05024'
  			},
  			gold: {
  				'50': '#FAF6ED',
  				'100': '#F5EDDB',
  				'200': '#EBDBB7',
  				'300': '#E1C993',
  				'400': '#D7B76F',
  				'500': '#d5bc82',
  				'600': '#AA9668',
  				'700': '#80714E',
  				'800': '#554B34',
  				'900': '#2B261A',
  				DEFAULT: '#d5bc82'
  			},
  			cyan: {
  				'50': '#E6F7FA',
  				'100': '#CCEFF5',
  				'200': '#99DFEB',
  				'300': '#66CFE0',
  				'400': '#33BFD6',
  				'500': '#00a7ce',
  				'600': '#0086A5',
  				'700': '#00647C',
  				'800': '#004352',
  				'900': '#002129',
  				DEFAULT: '#00a7ce'
  			},
  			charcoal: {
  				'50': '#f5f5f5',
  				'100': '#E8E8E8',
  				'200': '#979a98',
  				'300': '#979a98',
  				'400': '#686668',
  				'500': '#010101',
  				'600': '#010101',
  				'700': '#010101',
  				'800': '#010101',
  				'900': '#010101',
  				DEFAULT: '#010101'
  			},
  			grey: {
  				DEFAULT: '#979a98',
  				dark: '#686668'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
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
  		fontFamily: {
  			sans: [
  				'var(--font-montserrat)',
  				'system-ui',
  				'sans-serif'
  			],
  			serif: [
  				'var(--font-montserrat)',
  				'Georgia',
  				'serif'
  			]
  		},
  		animation: {
  			'fade-up': 'fadeUp 0.8s ease-out forwards',
  			'fade-in': 'fadeIn 0.6s ease-out forwards',
  			'gentle-float': 'gentleFloat 6s ease-in-out infinite'
  		},
  		keyframes: {
  			fadeUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			gentleFloat: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			}
  		},
  		transitionDuration: {
  			'400': '400ms',
  			'600': '600ms',
  			'800': '800ms'
  		},
  		boxShadow: {
  			soft: '0 4px 20px rgba(0, 0, 0, 0.06)',
  			elegant: '0 8px 30px rgba(0, 0, 0, 0.08)',
  			lift: '0 12px 40px rgba(0, 0, 0, 0.12)'
  		},
  		dropShadow: {
  			hero: '0 2px 4px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.2)',
  			heroText: '0 0 2px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7)'
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
