# **App Name**: BENO 1017 LIFESTYLE - CHIEF OF STAFF

## Core Features:

- Finance Intelligence: Automate budgeting, forecasting, and expense tracking by parsing financial statements with AI to auto-categorize, detect income vs expenses, forecast earnings, simulate budgets, predict upcoming charges, compare months, track debt, and provide a smart advisor chat panel.
- Vault & Docs Hub: Store, encrypt, and organize personal documents with AI tagging, auto-naming, shared folders, expiry date reminders, and quick-search.
- Schedule & Taskboard: Automate daily, weekly, and long-term tasks with a calendar view, AI-suggested reminders from messages/screenshots, smart notifications, routine templates, and linked reminders with files.
- Apartment / Household Manager: Centralize apartment and family management with member profiles, shared shopping lists (AI-suggested items), bill-splitter, home asset tracker, and monthly home budget overview.
- Shopping & Goals Board: Track goals visually with target amounts, progress bars, forecast completion dates, savings frequency recommendations, a wishboard, and integration with budget simulation.
- AI Simulation Engine: Provide 'what-if' forecasting and life scenario insights with visual results on timeline graphs and cashflow bars, acting as a tool for making recommendations about your behavior and choices.
- Dashboard Design (UI/UX): Immersive, infographic, futuristic dashboard with shortcuts, charts, progress wheels, forecast sliders, reminders, AI suggestions, and light/dark modes with neon gradient accents.
- User Profiles / Roles: Access control with roles for admin, family members (restricted view), and guest mode (read-only budgets).
- Deep AI Extraction & Smart Context: Allow uploads of any screenshot — banking app, paystub, invoice, email, even handwritten receipts. Use multi-modal AI (GPT-Vision / Gemini) to extract text, infer amounts, recognize categories automatically. Context learning: It remembers your recurring pay sources and bills (so “Bell Fibre” always maps to *Internet → Utility*).
- Life Simulation Mode: Add Life Scenarios (career, travel, housing, education). Example: *“If I start a diploma next year at $300/month, how does that affect savings + time?”* Timeline graph shows both money + time impacts.
- Household Digital Twin: Treat the apartment as a digital twin: track assets with photos, receipts, warranty expiry; shared calendar for maintenance; rent ledger and utility meters; “house health” score (bills paid, cleanliness, supplies stocked)
- People & Relationship Hub: Profiles for each brother / housemate / relative Personal vault sections and linked reminders (e.g., “Brother’s study permit renewal → June 2026”) Shared task and expense views.
- Wellness & Lifestyle Tracking: Integrate habits, routines, health logs, and mood / sleep / fitness data. Daily dashboard: *“Mood: 7/10 | Sleep: 6 hrs | Budget OK | Energy Low → suggest rest day.”* Optional integrations (Google Fit, Apple Health, or manual input).
- AI Concierge / Chief of Staff Persona: Built-in conversational assistant (“Beno” or “Grid”) that: reviews your week every Sunday, sends “morning brief” & “night summary”, recommends decisions (“Delay trip or adjust budget?”), speaks naturally like a *chief of staff* who knows your life.
- Security & Privacy Layer: Local encryption (AES-256) + biometric unlock Option for offline mode (local cache only) Zero-knowledge storage for vault files.
- Smart Reminders & Routine Automation: Conditional reminders: *“If account < $100 and Bell bill due → notify.”* Grouped by category (Finance / Health / Home). Natural-language creation: “Remind me to pay rent on 1st of every month.”
- Apartment-Scale Budget Sharing: One dashboard = multiple “rooms” (e.g., *Anthony’s room*, *Brother 1*, *Brother 2*, *Shared expenses*). Shared ledger with who-paid-what. Real-time bill status & debt reconciliation.
- Infographic Evolution: Adaptive dashboard that rearranges based on priorities. Example: pay week → finance focus view; weekend → lifestyle view. Visual metaphors (thermometers, progress rings, motion charts).
- Data Layer & Integration Blueprint: Explicitly define how data connects across modules: Unified Data Lake in Firebase (Finance, Wellness, Household all in one schema), API integrations (bank feeds via Plaid, Google Fit, Apple Health, Calendars, etc.), Backup & Sync policies. Ensures scalability and future integrations.
- Emergency / Crisis Management Module: Since it manages your entire life, include a Crisis Dashboard: Emergency contacts, insurance, vehicle info, medical ID, etc. Quick-action panel (“Send my location + medical info to brother”), Backup access (trusted contact can unlock vault in case of emergency)

## Style Guidelines:

- Dashboard layout with Net Worth, Next Bills, Today’s Schedule, Cashflow Graph, Savings Goals Progress, Uploaded Docs, Shopping & Essentials, and Forecast / AI Insights sections.
- Light and dark modes with neon gradient accents.