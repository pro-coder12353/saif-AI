
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1peWiryxF8gqDpD8wlgXouy2AgYnZC0EQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Saif-AI is a high-performance, Gemini-powered cybersecurity agent specifically engineered to defend UAE residents from digital fraud through advanced multimodal analysis of suspicious messages and screenshots. Serving as a comprehensive digital shield, the application allows users to instantly scan phishing attempts in five major languages—English, Arabic, Hindi, Urdu, and Tagalog—with specialized detection modules for prevalent logistics and government-ID scams. Beyond its core diagnostic engine, Saif-AI provides real-time community protection through a live threat heatmap integrated with Google Maps, an automated forensic reporting system for the Dubai Police Al Ameen service, and gamified educational tools designed to build natural cyber-immunity across the Emirates' diverse population.

Future Direction:
We will further implement this in androids as well as windows with messaging service and emails to send an automated response to users if scam messages or emails are detected.



 🛡️ Saif-AI: UAE Digital Defense Core

![Status](https://img.shields.io/badge/Status-Live-green)
![AI Model](https://img.shields.io/badge/AI-Gemini_3_Flash-blue)
![Localization](https://img.shields.io/badge/Translation-Lingo.dev-orange)
![Stack](https://img.shields.io/badge/Tech-React_19_%7C_Tailwind-cyan)

**Saif-AI** (Arabic for "Sword") is a next-generation cybersecurity agent designed specifically for the United Arab Emirates. Powered by **Google Gemini 3 Flash** and **Lingo.dev**, it acts as a multilingual shield against phishing, courier fraud, and identity theft targeting UAE residents.

---

## 🚨 The Problem
Cybercrime in the UAE is evolving. Residents face sophisticated scams including:
*   **Logistics Fraud:** Fake SMS from Emirates Post, Aramex, or DHL demanding "customs fees."
*   **Government Impersonation:** Phishing sites mimicking UAE Pass or Dubai Police.
*   **Language Barriers:** Vulnerable demographics are often targeted in languages they don't speak fluently.

## 💡 The Solution
Saif-AI is a web-based "Cyber Defense Core" that allows users to scan text and screenshots instantly. It doesn't just say "Scam" or "Safe"—it explains *why*, translates the analysis into 5 languages, and helps users report the threat to authorities immediately.

---

## ✨ Key Features

### 🧠 1. Multimodal Threat Scanner (Gemini Powered)
*   **Image Analysis:** Users can upload screenshots of suspicious WhatsApp messages or emails. The AI performs OCR and visual analysis to detect forged logos and urgency cues.
*   **Text Analysis:** Paste raw text or URLs for instant verification.
*   **Risk Scoring:** Returns a 0-100 risk score with a tactical breakdown of the threat.

### 🌐 2. Dynamic Multilingual Support (Lingo.dev)
To serve the UAE's diverse population, the app helps verify threats in:
*   🇬🇧 **English**
*   🇦🇪 **Arabic**
*   🇮🇳 **Hindi**
*   🇵🇰 **Urdu**
*   🇵🇭 **Tagalog**
*   *Powered by the Lingo.dev API for high-accuracy, context-aware translation.*

### 📦 3. Delivery Shield
A specialized module trained to recognize logistics fraud patterns. It specifically looks for tracking URL spoofing (e.g., `emirates-post.net` vs `emiratespost.ae`) and "small fee" payment gateways.

### 🗺️ 4. Live Threat Map
A real-time visualization overlay (using Google Maps) that displays a heat map of active scam reports across Dubai, Abu Dhabi, and Sharjah, keeping the community informed.

### 👮 5. One-Click Authority Reporting
If a scam is detected, Saif-AI auto-generates a pre-formatted SMS report for **Al Ameen Service (8004888)**, allowing users to report threats to UAE Law Enforcement in seconds.

### 🎮 6. Gamified Cyber Training
An interactive "Real vs. Scam" quiz module that awards XP and ranks (Novice to Cyber Guardian), helping users build natural defensive instincts.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 | Latest React features for a responsive UI. |
| **Styling** | Tailwind CSS | "Cyberpunk" dark mode aesthetic with glassmorphism. |
| **AI Brain** | Google GenAI SDK | Uses `gemini-3-flash-preview` for ultra-fast multimodal analysis. |
| **Localization** | Lingo.dev API | Handles dynamic translation of UI and Analysis results. |
| **Icons** | Lucide React | Lightweight, consistent iconography. |
| **Maps** | Google Maps Embed | Visualizing threat data. |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   Google Gemini API Key: AIzaSyA8S4YQTf0Tu-ChZK4UydeCUHSLxVucGg8
*   Lingo.dev API Key: api_nhylbwi8dend1l05hznzoxof

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/saif-ai.git
    cd saif-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root directory:
    ```env
    # Your Google Gemini API Key
    API_KEY=your_google_api_key_here
    
    # (Optional) Key is currently hardcoded in service for demo purposes, 
    # but best practice is to put Lingo key here too.
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

5.  Open your browser at `http://localhost:5173`.

---

## 📸 Usage Scenarios

1.  **The "Customs Fee" SMS:** A user receives an SMS asking for 15 AED for a package. They upload a screenshot to Saif-AI. The AI detects the fake URL and warns the user it is a scam.
2.  **The "Police Fine" Email:** A user gets a PDF claiming to be a fine. They paste the text. Saif-AI cross-references the official Dubai Police email format and flags it as phishing.
3.  **Non-English Speakers:** An Urdu-speaking resident uses the app in Urdu to understand why a "Bank Account Frozen" message is fake.

---

## 🔮 Future Roadmap

*   **Voice Mode:** Real-time audio analysis for incoming phone calls to detect AI voice cloning and vishing (Voice Phishing).
*   **WhatsApp Bot:** Integration directly into WhatsApp for easier forwarding of suspicious messages.
*   **Community API:** An open API for local banks to feed real-time scam data into the Threat Map.

---

## ⚠️ Disclaimer
*Saif-AI is a tool for analysis and education. While it uses advanced AI to detect patterns, it does not guarantee 100% accuracy. Always contact official entities (Bank, Police, Post Office) directly through official channels to verify claims. In case of financial loss, contact UAE authorities immediately.*

---

Made with ❤️ in Dubai.
