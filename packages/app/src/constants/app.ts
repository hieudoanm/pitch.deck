export const INITIAL_THEME = 'coffee';

export const THEMES: { group: string; theme: string }[] = [
	// 🌤 Light themes
	{ group: 'Light', theme: 'acid' },
	{ group: 'Light', theme: 'autumn' },
	{ group: 'Light', theme: 'bumblebee' },
	{ group: 'Light', theme: 'corporate' },
	{ group: 'Light', theme: 'cupcake' },
	{ group: 'Light', theme: 'cmyk' },
	{ group: 'Light', theme: 'emerald' },
	{ group: 'Light', theme: 'fantasy' },
	{ group: 'Light', theme: 'garden' },
	{ group: 'Light', theme: 'lemonade' },
	{ group: 'Light', theme: 'light' },
	{ group: 'Light', theme: 'lofi' },
	{ group: 'Light', theme: 'nord' },
	{ group: 'Light', theme: 'pastel' },
	{ group: 'Light', theme: 'lemonade' },
	{ group: 'Light', theme: 'winter' },
	{ group: 'Light', theme: 'wireframe' },

	// 🌙 Dark themes
	{ group: 'Dark', theme: 'black' },
	{ group: 'Dark', theme: 'business' },
	{ group: 'Dark', theme: 'coffee' },
	{ group: 'Dark', theme: 'dark' },
	{ group: 'Dark', theme: 'dim' },
	{ group: 'Dark', theme: 'dracula' },
	{ group: 'Dark', theme: 'forest' },
	{ group: 'Dark', theme: 'halloween' },
	{ group: 'Dark', theme: 'luxury' },
	{ group: 'Dark', theme: 'night' },
	{ group: 'Dark', theme: 'sunset' },

	// 🎨 Colorful / fun
	{ group: 'Fun', theme: 'abyss' },
	{ group: 'Fun', theme: 'aqua' },
	{ group: 'Fun', theme: 'retro' },
	{ group: 'Fun', theme: 'caramellatte' },
	{ group: 'Fun', theme: 'cyberpunk' },
	{ group: 'Fun', theme: 'synthwave' },
	{ group: 'Fun', theme: 'valentine' },
];

export const INITIAL_CONTENT: string = `title:
  product: PitchDeckGen
  tagline: Create stunning pitch decks in minutes
  audience: Startup founders & entrepreneurs, early-stage startups, and solo founders

problems:
  title: The Core Problems Founders Face
  subtitle: Why creating a strong pitch deck is harder than it should be

  items:
    - emoji: ⏱️
      title: Time-consuming slide creation
      description: Creating slides manually takes hours, slowing down fundraising and pitch preparation.
      impact: Delays investor meetings and reduces productivity
      severity: high
      userType: founders
    - emoji: 🛠️
      title: Complex or generic tools
      description: Existing tools are either too complex for beginners or too generic for tailored presentations.
      impact: Users spend extra time learning software or end up with generic slides
      severity: medium
      userType: early-stage startups
    - emoji: 🎨
      title: Design challenges for non-designers
      description: Non-designers struggle to make slides visually appealing, leading to inconsistent or unprofessional decks.
      impact: Pitch decks fail to capture attention or communicate value effectively
      severity: high
      userType: solo founders, small teams

solutions:
  title: How it works
  subtitle: A simple workflow designed for busy founders

  items:
    - step: 1
      emoji: 📝
      title: Input your idea
      description: Add your key points, company info, and metrics to outline your pitch.
    - step: 2
      emoji: 📤
      title: Export
      description: Export your deck to PDF, PowerPoint, or Google Slides for presentations.
    - step: 3
      emoji: 🔗
      title: Share
      description: Share your deck with investors, team members, or collaborators easily.

product:
  title: Everything you need to pitch
  subtitle: What users can do with it

  features:
    - emoji: 🤖
      title: AI-assisted slide creation
      description: Turn simple prompts into professional slides instantly.
    - emoji: 🎨
      title: Customizable templates
      description: Adjust colors, fonts, and layout to match your brand.
    - emoji: 📤
      title: Export to multiple formats
      description: Export your pitch deck to PDF, PowerPoint, or Google Slides.

pricing:
  title: Simple Pricing
  subtitle: Choose a plan that fits how often you pitch

  model: one-time
  currency: USD

  plans:
    - name: Free
      amount: 0.00
      frequency: free
      description: Create and export your first pitch deck at no cost

    - name: Pay As You Go
      amount: 1.99
      frequency: per deck
      description: Pay only when you export a new pitch deck

    - name: Lifetime
      amount: 9.99
      frequency: one-time
      description: Unlimited pitch decks with a single payment
`;
