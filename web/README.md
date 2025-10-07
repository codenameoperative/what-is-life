# What is Life

A modern idle/incremental game built with React, TypeScript, and Tailwind CSS. Experience various life activities, collect items, earn WTC (What The Currency), and build your virtual life!

## 🎮 **What is Life?**

A comprehensive life simulation game built with React, TypeScript, and modern web technologies. Experience the thrill of digital entrepreneurship, exploration, and survival in a dynamic world where every choice matters.

### 🎯 **Core Features**

#### **📊 Level & Achievement System**
- **50-Level Progression**: Earn XP through activities, unlock rewards and titles
- **Achievement Categories**: Activity Masters, Wealth Builders, Survivors, Collectors, Level Climbers
- **Dynamic Titles**: Earn and equip special titles like "The Explorer", "Master Angler", "Green Thumb"
- **Death Penalties**: Higher levels bring greater rewards but greater risks on death

#### **🏆 Achievements (20+ Achievements)**
- **Activity Achievements**: First Steps, The Explorer, Master Angler, Green Thumb, Workaholic
- **Wealth Achievements**: First Million, Bank Account
- **Survival Achievements**: Survivor, Ghost (10 deaths)
- **Level Achievements**: Apprentice (Lv.10), Expert (Lv.25), Master (Lv.50)
- **Special Achievements**: Speedrunner, Completionist (unlock all achievements)

#### **💰 Economic System**
- **Multiple Currencies**: Wallet, Bank, Stash
- **Item Trading**: Buy, sell, and collect rare items
- **Market Dynamics**: Rotating shop inventory
- **Tier System**: 7 item tiers from useless to mythical

### ✅ **Implemented Activities:**

#### **1. Search** 🕵️
- **Requirements:** None
- **Mechanics:** RNG-based item discovery (useless → WDYFT tier items)
- **Cooldown:** 5 seconds
- **Outcomes:** Items only, no WTC rewards

#### **2. Crime** 🦹
- **Requirements:** None
- **Mechanics:** Risk/reward system with jail time
- **Cooldown:** Variable (jail time: 10-60s)
- **Outcomes:** WTC rewards (50-200) with success rate and risk penalties

#### **3. Work** 💼
- **Requirements:** None (future: jobs with requirements)
- **Mechanics:** Job system with energy cost
- **Cooldown:** 30 seconds
- **Outcomes:** WTC earnings (10-50) with job progression

#### **Phaser.js Character Creation** 🎨
- **Pixel Art Characters**: Procedurally generated pixel art sprites
- **Appearance Customization**: Skin tone, hair style/color, eye color options
- **Starter Clothing**: Choose from multiple clothing sets (tops, bottoms, shoes)
- **Interactive Creator**: Real-time preview with Phaser.js rendering
- **Persistent Characters**: Character data saved with game progress

#### **4. Hunt** 🦌
- **Requirements:** Hunting Rifle (item required)
- **Mechanics:** Location-based hunting with animal capture
- **Cooldown:** 5 seconds
- **Outcomes:** Animals, items, treasure chests (40k-80k WTC)
- **Locations:** Forest, Cave, Backyard

#### **5. Fish** 🎣
- **Requirements:** Fishing Rod (item required)
- **Mechanics:** Location-based fishing with fish catch
- **Cooldown:** 5 seconds
- **Outcomes:** Fish, items, pirate stashes (40k-90k WTC)
- **Locations:** River, Sea, Ocean

#### **6. Dig** ⛏️
- **Requirements:** Shovel or Pickaxe
- **Mechanics:** Location-based digging for ores
- **Cooldown:** 5 seconds
- **Outcomes:** Ores (14 types), buried treasure (40k-80k WTC)
- **Locations:** Forest, Cave, Backyard

#### **7. Post** 📱
- **Requirements:** Phone, Laptop, or PC Setup
- **Mechanics:** Meme posting with platform selection
- **Cooldown:** 10 seconds
- **Outcomes:** WTC rewards, items, viral success, or failure
- **Platforms:** YouTube, Twitter, Reddit, Discord, WhatsApp, Instagram, Facebook

#### **8. Stream** 🎥
- **Requirements:** Phone, Laptop, or PC Setup
- **Mechanics:** Live streaming with duration and platform selection
- **Cooldown:** 10 seconds
- **Outcomes:** WTC rewards based on duration, viral potential, items
- **Types:** Gaming, Vlog, Blog, Music, Art, Chat
- **Platforms:** YouTube, Twitch, TikTok, Kick, Instagram, Facebook
- **Duration Options:** 5-60 minutes with scaling rewards

#### **9. Explore** 🗺️
- **Requirements:** None (but Revival Bill recommended)
- **Mechanics:** Location-based exploration with item selection and choice-based narrative
- **Cooldown:** Variable (30-60 seconds based on location)
- **Outcomes:** WTC rewards, items, or death (prevented by Revival Bill)
- **Locations:** Forest, Mountain, Ruins, Beach, Swamp (5 locations)
- **Death Risk:** Variable chance (0.3%-3%) - Revival Bill prevents total loss
- **Level Impact:** Higher levels = greater WTC/item losses on death

#### **10. Garden** 🌱
- **Requirements:** None
- **Mechanics:** Plant cultivation with 4 garden plots, watering system, pest protection, and harvesting
- **Cooldown:** Variable (2-5 seconds per action)
- **Plants:** 10 different plants (carrots, tomatoes, potatoes, herbs, flowers, magical plants)
- **Pests:** Wild animals can attack unprotected gardens (prevented by Scarecrow)
- **Scarecrow:** Rare tool that reduces pest attacks by 80% (can break on equip)
- **Features:** Persistent growth, real-time notifications, watering bonuses

### ✅ **Game Systems:**

#### **🎛️ Settings & Automation** ⚙️
- **Settings Page**: Comprehensive settings with toggles for gameplay preferences
- **Automated Grinding**: Automatically perform available activities when enabled
- **Light Mode**: Theme toggle (coming soon)
- **Double Confirmations**: Optional confirmation dialogs for sensitive actions
- **Animation Controls**: Speed controls for UI animations
- **Sound Settings**: Audio preferences (coming soon)

#### **Inventory & Items** 🎒
- **Universal Item System:** All items follow consistent structure
- **Tier System:** useless → common → uncommon → rare → epic → legendary → mythical → wdyft
- **Categories:** weapons, tools, clothing, collectables, animals, fish, ores
- **Stackable Items:** animals, clothing, collectables, ores
- **Item Properties:** value, usability, break chance, source tracking

#### **Currency & Rewards** 💰
- **WTC (What The Currency):** Primary game currency
- **Reward Ranges:** Activities offer varying WTC amounts
- **Treasure Systems:** Hidden chests/stashes with bonus rewards
- **Item Values:** All items have WTC sell values

#### **UI/UX Features** 🎨
- **Consistent Design:** Black background, white text, modern styling
- **Cooldown System:** Visual timers and disabled states
- **Activity Transitions:** 50ms fade effects
- **Notifications:** Toast notifications for all outcomes
- **Responsive Layout:** Works on mobile and desktop

## 🔧 **Technical Implementation**

### **Architecture:**
```
src/
├── activities/          # Activity components
│   ├── Search/
│   ├── Crime/
│   ├── Work/
│   ├── Hunt/
│   ├── Fish/
│   ├── Dig/
│   └── Post/
├── components/          # Reusable UI components
├── contexts/            # React contexts (Game, Notify)
├── utils/              # Game logic and data
│   ├── items/          # Item definitions
│   ├── rng.ts          # Random number generation
│   ├── memeTypes.ts    # Post activity data
│   └── postingPlatforms.ts
└── App.tsx             # Main app component
```

### **Key Technologies:**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Context API** for state management
- **Custom RNG System** for fair outcomes
- **Modular Architecture** for easy expansion

## 📋 **Next Steps & Roadmap**

### **🔄 Immediate Priorities:**

#### **1. Stream Activity** 🎮
- **Requirements:** Streaming setup equipment
- **Mechanics:** Live streaming with viewer interaction
- **Features:** Subscriber system, donation mechanics, follower growth
- **Platforms:** Twitch, YouTube Gaming, etc.

#### **2. Item Crafting System** ⚒️
- **Requirements:** Crafting stations/tools
- **Mechanics:** Combine items to create better equipment
- **Features:** Recipes, crafting levels, material requirements
- **Recipes:** Tools, weapons, equipment, setups

#### **3. Job Progression** 💼
- **Requirements:** Experience/levels for job advancement
- **Mechanics:** Career ladder with better pay/jobs
- **Features:** Job requirements, promotion system, skill trees

### **🎯 Medium-term Goals:**

#### **4. Shop System** 🛒
- **Features:** Buy/sell items, equipment upgrades
- **Currency:** WTC-based economy
- **Stock:** Rotating inventory, special deals

#### **5. Achievement System** 🏆
- **Tracking:** Activity completion, milestones
- **Rewards:** Special items, bonuses, unlocks
- **Progression:** Visual achievement gallery

#### **6. Social Features** 👥
- **Leaderboards:** WTC rankings, activity stats
- **Sharing:** Export/import save data
- **Community:** Global statistics

### **🚀 Long-term Vision:**

#### **7. Multiplayer Elements** 🌐
- **Co-op Activities:** Team-based challenges
- **Trading:** Player-to-player item exchange
- **Guilds:** Social groups with shared goals

#### **8. Story/Quest System** 📖
- **Narrative:** Life progression quests
- **Challenges:** Special events and objectives
- **Lore:** Backstory and world-building

#### **9. Advanced Features** ⚡
- **Automation:** Hire managers for passive income
- **Prestige:** Reset for multipliers and unlocks
- **Mini-games:** Skill-based activities

## 🛠️ **Development Setup**

### **Requirements:**
- Node.js 18+
- npm 9+
- Supabase account (for authentication)

### **Supabase Setup:**
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Copy `env.example` to `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the SQL migration in your Supabase SQL editor:
   ```sql
   create table profiles (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) on delete cascade not null,
     username text unique not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
     game_data text
   );
   ```

### **Install and Run:**
```bash
npm install
npm run dev
```

### **Available Scripts:**
- `npm run dev` - Development server (http://localhost:5173)
- `npm run build` - Production build
- `npm run preview` - Preview production build

### **Tech Stack:**
- **Vite** - Build tool and dev server
- **React + TypeScript** - UI framework
- **Tailwind CSS** - Styling framework
- **Context API** - State management
- **Custom RNG** - Fair random outcomes

## 📊 **Game Statistics**

#### **Current Activity Status:**
- ✅ **10/10 Activities** implemented (100% complete)
- ✅ **Item System** fully functional
- ✅ **UI/UX** polished and consistent
- ✅ **Core Mechanics** working smoothly

#### **Level & Achievement Progress:**
- ✅ **Level System**: XP progression with rewards
- ✅ **Achievement System**: 20+ achievements across 6 categories
- ✅ **Title System**: Earnable and equippable titles
- ✅ **Death Penalties**: Level-scaled loss system

#### **Code Quality:**
- **TypeScript:** 100% type coverage
- **Modular:** Clean separation of concerns
- **Maintainable:** Consistent patterns and architecture
- **Scalable:** Easy to add new features

#### **Level System Mechanics:**
- **XP Sources**: All activities grant XP (5-35 XP per completion)
- **Level Rewards**: WTC bonuses, items, and titles at milestones
- **Death Penalties**: Higher levels lose more WTC/items (30% + 5% per level, max 100%)
- **Max Level**: 50 levels with exponential XP requirements
- **Title System**: Earn special titles through achievements and level milestones

### **Performance:**
- **Fast Loading:** Optimized bundle size
- **Smooth UX:** 60fps animations and transitions
- **Efficient State:** Context-based state management
- **Memory Safe:** No memory leaks in activity cycles

## 🎮 **How to Play**

1. **Choose an Activity:** Click any available activity button
2. **Meet Requirements:** Ensure you have required items/equipment
3. **Perform Action:** Click the action button and wait for results
4. **Collect Rewards:** WTC and items are automatically added to your inventory
5. **Manage Cooldown:** Wait for the cooldown before repeating (5-10 seconds depending on activity)
6. **Build Your Life:** Use earnings to buy better equipment and unlock new activities

## 🤝 **Contributing**

This project is actively developed. Key areas for contribution:
- New activity implementations
- UI/UX improvements
- Game balance adjustments
- Feature requests and bug reports
- developed by CodeNameOperative

---

**Built with ❤️ By CodeNameOperative**
