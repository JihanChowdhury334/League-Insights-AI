# 🎮 League Insights AI

**Are You The Problem?** Find out with AI-powered analytics for your League of Legends performance.

## ⚠️ Demo Note (Pre-Cached Players)

To ensure fast loading during demos, judging, and public testing, this app uses **pre-cached match data for the following 4 players**:

- **EMP#2005**
- **Ash#69420**
- **GoreToBore#000**
- **shamt#FUMED**

Searching any other Riot IDs will trigger **full year-long match-history aggregation**, which may result in **significantly longer loading times** depending on the number of games played.

## 🌍 Region Support

League Insights AI **supports all Riot regions**, including:

- **NA**
- **EUW**
- **EUNE**
- **KR**
- **BR**
- **LAN**
- **LAS**
- **OCE**
- **JP**
- **TR**
- **RU**
- **PH2**
- **SG2**
- **TH2**
- **TW2**
- **VN2**
- **and all other active Riot routing regions**

Region is automatically detected based on your Riot ID (`gameName#tagLine`), so **no manual input is required**.

League Insights AI is a full-stack web application that analyzes your League of Legends match history, providing deep insights into your gameplay patterns, strengths, weaknesses, and playstyle using advanced timeline analysis and AI-generated narratives powered by AWS Bedrock (Claude).

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-deployment-url.vercel.app)
[![Backend](https://img.shields.io/badge/backend-Flask-blue)](https://github.com/JihanChowdhury334/League-Insights-AI)
[![Frontend](https://img.shields.io/badge/frontend-Next.js-black)](https://github.com/JihanChowdhury334/League-Insights-AI)

---
## 🖼️ Gallery

Explore League Insights AI in action — from data-driven stats to AI-powered recaps.

### Overview & Stats
![Stats Overview](./gallery1.jpg)

### Extreme Games & Monthly Trends
![Extreme Games](./gallery2.jpg)

### Timeline Insights
![Timeline Overview](./gallery3.jpg)

### Playstyle Identity
![Playstyle Identity](./gallery4.jpg)

### Kill Heatmap
![Kill Heatmap](./gallery5.jpg)

### AI Recap Summary
![AI Recap](./gallery6.jpg)


## ✨ Features

### 📊 **Comprehensive Match Statistics**
- **Year-Long Analysis**: Fetches and analyzes up to one year of match history
- **Core Stats**: K/D/A, win rate, CS per minute, damage share, gold share, vision score
- **Role Performance**: Detailed breakdown of performance by role (Top, Jungle, Mid, ADC, Support)
- **Champion Mastery**: Most played champions and performance metrics
- **Monthly Trends**: Visualize your progress over time with monthly statistics

### ⏱️ **Advanced Timeline Analysis**
- **Early Game Dominance**: Measures your gold advantage in the first 10 minutes
- **Midgame Swing**: Tracks volatility and adaptability in the 10-20 minute window
- **Consistency Score**: Evaluates performance stability across matches
- **Roam Score**: Analyzes map movement and roaming patterns
- **Comeback Analysis**: Identifies games where you came back from behind or threw a lead
- **Level Milestones**: Tracks power spike timings (Level 6, 11, 16)
- **Objective Control**: Heatmap of kills and objective participation

### 🤖 **AI-Powered Year Recap**
- **Personality Profile**: Claude AI generates a personalized playstyle analysis
- **Strengths & Weaknesses**: Data-driven identification of what you do well and where to improve
- **Actionable Tips**: Specific, personalized recommendations to climb ranked
- **Fun Highlights**: Memorable moments from your year of gameplay

### 📈 **Interactive Visualizations**
- Role distribution pie charts
- Monthly performance trends
- Extreme game highlights (highest kills, worst deaths, etc.)
- Champion pool analysis
- Game mode breakdowns

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom animations
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Charts**: [Recharts](https://recharts.org/) for data visualization
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Type-safe development

### **Backend**
- **Framework**: [Flask](https://flask.palletsprojects.com/) (Python)
- **API**: [Riot Games API](https://developer.riotgames.com/)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic for database version control
- **AI Integration**: [AWS Bedrock](https://aws.amazon.com/bedrock/) (Claude 3 Haiku)
- **Async Processing**: aiohttp for concurrent API calls
- **CORS**: Flask-CORS for cross-origin requests

### **Infrastructure**
- **Frontend Hosting**: Vercel (recommended)
- **Backend Hosting**: Render.com / Railway.app / Heroku
- **Database**: PostgreSQL (via Render/Railway)
- **AI Service**: AWS Bedrock

---

## 📦 Installation & Setup

### **Prerequisites**
- Python 3.10+
- Node.js 18+
- PostgreSQL database
- Riot Games API key ([Get one here](https://developer.riotgames.com/))
- AWS account with Bedrock access (optional, for AI recap)

### **Backend Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/JihanChowdhury334/League-Insights-AI.git
   cd League-Insights-AI/backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   RIOT_API_KEY=your_riot_api_key_here
   DATABASE_URL=postgresql://user:password@localhost:5432/league_insights
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   PORT=5000
   ```

5. **Initialize the database**
   ```bash
   flask db upgrade
   ```

6. **Run the backend server**
   ```bash
   python app.py
   ```
   
   Backend will be available at `http://localhost:5000`

### **Frontend Setup**

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend/my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Update `lib/api.ts` with your backend URL:
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:3000`

---

## 🚀 Deployment

### **Deploy Frontend to Vercel**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Import your repository
4. Set **Root Directory** to `frontend/my-app`
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
6. Deploy!

### **Deploy Backend to Render.com**

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Environment**: Python 3
4. Add environment variables from your `.env` file
5. Create a PostgreSQL database and link it
6. Deploy!

**Note**: Add `gunicorn` to your `requirements.txt`:
```bash
echo "gunicorn==21.2.0" >> backend/requirements.txt
```

---

## 📖 API Documentation

### **Core Endpoints**

#### `GET /get-stats`
Fetches match history and computes comprehensive statistics.

**Query Parameters:**
- `gameName` (string): Riot ID game name
- `tagLine` (string): Riot ID tag line

**Response:**
```json
{
  "profile": {
    "gameName": "Player",
    "tagLine": "NA1",
    "total_matches": 150,
    "win_rate": "52.67"
  },
  "core_averages": { ... },
  "impact_stats": { ... },
  "role_performance": { ... }
}
```

#### `GET /process-timelines`
Processes timeline data for advanced insights.

**Query Parameters:**
- `gameName` (string)
- `tagLine` (string)

#### `GET /get-timeline-stats`
Retrieves aggregated timeline insights.

**Query Parameters:**
- `gameName` (string)
- `tagLine` (string)

#### `POST /generate-recap`
Generates AI-powered year recap using AWS Bedrock.

**Request Body:**
```json
{
  "gameName": "Player",
  "tagLine": "NA1"
}
```

**Response:**
```json
{
  "recap": {
    "personality_profile": "...",
    "strengths": [...],
    "weaknesses": [...],
    "playstyle_summary": "...",
    "actionable_tip": "..."
  }
}
```

---

## 🎯 How It Answers "Are You The Problem?"

This app helps you objectively determine if **you're the reason your team is losing** by analyzing multiple dimensions of your gameplay:

### 🔍 **Core Metrics That Reveal The Truth**

1. **Kill Participation (KP%)**
   - Are you involved in your team's fights? Or AFK farming while your team dies?
   - **Target**: 60%+ KP means you're contributing, <40% = you're invisible

2. **Damage Share**
   - Are you actually dealing damage or just existing on the map?
   - **Reality Check**: If you're <25% damage share as a carry, you're the problem

3. **Gold Share & CS/min**
   - Are you taking resources but not converting them to wins?
   - **Red Flag**: High gold share + low damage share = resource black hole

4. **Vision Score & Vision Share**
   - Are you helping your team see the map, or playing blind?
   - **Support Check**: <30% vision share as support = you're trolling
   - **Everyone**: Low vision score = you're playing in the dark

5. **Death Share & Time Dead**
   - Are you constantly dead and making your team play 4v5?
   - **Warning**: Highest deaths on team consistently = feeding liability

### 📊 **Timeline Analysis - Pattern Recognition**

1. **Early Game Dominance Score**
   - Consistently negative early game = you lose lane every game = you're the problem
   - Can't win early? Need to improve laning fundamentals

2. **Consistency Score**
   - <40% consistency = "coinflip player" = unreliable = problem
   - You're either 10/0 or 0/10 with no in-between

3. **Comeback vs Throw Ratio**
   - Lots of "throws" = you can't close games = mental problem
   - Never have comebacks = you give up when behind = mental problem

4. **Roam Score**
   - Lane anchored with low impact = not helping team = problem
   - Over-roaming with low CS = bad macro = problem

### 🤖 **AI Recap - The Brutal Truth**

Claude AI analyzes your entire year and tells you:
- **Your 3 Biggest Weaknesses** (data-backed, not opinions)
- **Specific Actionable Tips** (exactly what to fix)
- **Playstyle Problems** (e.g., "You're a coinflip player who ints early game")

### ✅ **When You're NOT The Problem**

You'll see:
- ✅ High KP% (60%+)
- ✅ High damage/gold efficiency
- ✅ Good vision control
- ✅ Consistent performance (70%+ consistency score)
- ✅ Positive early game dominance
- ✅ Low death share relative to team
- ✅ High comeback rate, low throw rate

### ❌ **When You ARE The Problem**

Red flags to watch for:
- ❌ Low KP% (<40%) = not helping team
- ❌ Low damage share despite resources = inefficient
- ❌ High death rate = feeding
- ❌ Negative early game dominance = lose lane every game
- ❌ Low consistency score = unreliable
- ❌ High throw rate = can't close games
- ❌ Low vision score = playing blind
- ❌ AI recap calls out your weaknesses consistently

### 💡 **Example Insights**

**Good Player (Not The Problem):**
```
KP: 68% | Damage Share: 32% | Deaths: 3.2 avg
Early Dominance: +250 gold | Consistency: 78%
Comeback Wins: 15 | Throws: 2
→ "You're a stable, high-impact player who helps your team win"
```

**Problem Player:**
```
KP: 35% | Damage Share: 18% | Deaths: 6.8 avg
Early Dominance: -180 gold | Consistency: 32%
Comeback Wins: 1 | Throws: 12
→ "You lose lane, don't help team, and throw leads. Yes, you're the problem."
```

---

## 🎮 Usage

1. **Enter your Riot ID** (e.g., `PlayerName#NA1`)
2. **Fetch Stats**: Click to load your match history (may take 2-3 minutes for full year)
3. **View Statistics**: Explore your performance across different metrics
4. **Process Timelines**: Click to analyze match-by-match progression (another 2-3 minutes)
5. **Generate AI Recap**: Get personalized insights from Claude AI
6. **Face The Truth**: Accept your weaknesses and improve, or cope and stay hardstuck 😎

---

## 🗂️ Project Structure

```
League-Insights-AI/
├── backend/
│   ├── app.py                  # Main Flask application
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables (not in repo)
│   └── migrations/             # Database migrations
│       ├── alembic.ini
│       ├── env.py
│       └── versions/           # Migration scripts
├── frontend/
│   └── my-app/
│       ├── app/                # Next.js app directory
│       │   ├── page.tsx        # Home page
│       │   ├── stats/          # Stats dashboard
│       │   ├── timeline/       # Timeline analysis
│       │   └── recap/          # AI recap page
│       ├── components/         # React components
│       │   ├── navigation.tsx
│       │   └── ui/             # Reusable UI components
│       ├── lib/
│       │   ├── api.ts          # API client
│       │   ├── types.ts        # TypeScript types
│       │   └── utils.ts        # Utility functions
│       └── public/             # Static assets
└── README.md                   # This file
```

---

## 🔧 Configuration

### **Database Models**

#### **Match**
Stores comprehensive match statistics with 30+ fields including:
- Identity: `role`, `champion`, `puuid`
- Combat: `kills`, `deaths`, `assists`, `damage`, `damage_taken`
- Economy: `gold`, `cs`, `vision`
- Objectives: `dragons`, `barons`, `heralds`, `towers`
- Team Context: `team_kills`, `team_damage`, `team_gold`

#### **MatchTimelineSummary**
Stores advanced timeline insights:
- `early_dominance_score`: Gold lead at 10 minutes
- `midgame_swing_score`: Volatility indicator
- `consistency_score`: Performance stability
- `roam_score`: Map mobility metric
- `comeback_type`: Game narrative classification

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## 🙏 Acknowledgments

- **Riot Games** for the comprehensive League of Legends API
- **AWS** for Bedrock AI services
- **Vercel** for seamless frontend deployment
- **Radix UI** for accessible component primitives
- **shadcn/ui** for beautiful UI inspiration

---

## 📧 Contact

**Jihan Chowdhury**
- GitHub: [@JihanChowdhury334](https://github.com/JihanChowdhury334)
- Project Link: [https://github.com/JihanChowdhury334/League-Insights-AI](https://github.com/JihanChowdhury334/League-Insights-AI)

---

## ⚠️ Disclaimer

League Insights AI isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

---

**Built with ❤️ for the League of Legends community**
