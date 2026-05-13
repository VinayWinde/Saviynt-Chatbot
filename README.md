# SaviyntBot 🛡️
SaviyntBot is an enterprise-grade Identity & Access Management (IAM) assistant designed for the Saviynt Identity Cloud. It leverages AI to simplify complex data exploration through natural language.

🚀 Overview
SaviyntBot serves as an intelligent bridge between human language and complex relational databases. It allows IAM engineers and auditors to query identity data, risk levels, and entitlements without writing manual SQL.

✨ Key Features
NL2SQL Engine: Translates plain English into precise SQL queries for Saviynt schemas.

Futuristic UI: A high-performance "Security Console" aesthetic featuring Glassmorphism and light navy styling.

Tactical Navigation: Custom-designed "History" and "Schema" explorers with industrial, angular button designs.

WhatsApp-Style Interface: A familiar chat environment with a custom-themed identity icon wallpaper (Shields, Users, and Keys).

Secure Architecture: Built with React + Vite, utilizing environment variables for secure API management.

🛠️ Technical Stack
Frontend: React 18, Vite

Styling: Modern CSS3 (Flexbox, Grid, Clip-path, Backdrop-filters)

Intelligence: OpenRouter API (Meta-Llama 3.3 / Claude)

Security: Dotenv for environment variable protection

📦 Installation & Setup
Clone the repository:

Bash
git clone(https://github.com/VinayWinde/Saviynt-Chatbot/blob/main/README.md)
cd saviynt-sql-bot
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env file in the root directory and add your keys:

Code snippet
VITE_OPENROUTER_API_KEY=your_key_here
VITE_OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
Run Development Mode:

Bash
npm run dev
