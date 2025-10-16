🔍 BlockCheck - Starknet Wallet Verification DApp


🎯 Overview
BlockCheck is a decentralized application (DApp) built on Starknet that empowers crypto users to make safer transactions by providing comprehensive wallet address verification and analysis before sending funds.

Key Features
✅ Wallet Analysis - View detailed transaction history and patterns
✅ Visual Dashboard - Interactive charts and infographics
✅ Risk Assessment - Identify suspicious activity patterns
✅ Watchlist - Save and monitor addresses
✅ Future Ready - On-chain tagging system (coming soon)

🚀 Quick Start


🧱 Tech Stack
Frontend
React 18 - UI framework
Vite - Build tool and dev server
TailwindCSS - Styling
Chart.js - Data visualization
Starknet.js - Blockchain interaction
Smart Contracts
Cairo - Starknet smart contract language
Scarb - Cairo package manager
Data Sources
Starknet.js RPC
Voyager API
Starkscan API

📁 Project Structure
blockcheck/
├── client/src/          # React frontend application
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   └── assets/         # Images and icons
├── contracts/          # Cairo smart contracts
│   ├── src/           # Contract source code
│   └── tests/         # Contract tests
└── public/            # Static assets


🎨 Usage
1. Connect Wallet
Click "Connect Wallet" and select your Starknet wallet (ArgentX or Braavos).

2. Search Address
Enter any Starknet wallet address in the search bar.

3. View Analysis
Review the comprehensive dashboard showing:

Transaction count and volume
Token types and distribution
Activity timeline
Counterparty analysis
Risk indicators

4. Save to Watchlist
Add addresses to your watchlist for quick access later.

5. Tag Wallets (Coming Soon)
Add custom tags and notes to addresses for personal reference.

🔮 Roadmap
Phase 1 - MVP (Current)
 Wallet address search
 Transaction history fetch
 Visual dashboard with charts
 Local watchlist
 Wallet connection
Phase 2 - On-Chain Features
 Cairo smart contract deployment
 On-chain wallet tagging
 Reputation scoring system
 Community flagging
Phase 3 - Advanced Features
 Multi-chain support
 Advanced analytics
 API for developers
 Mobile app



# Format code
scarb fmt
🔐 Security
All wallet connections use official Starknet wallet SDKs
No private keys are stored or transmitted
Watchlist data stored locally in browser
Smart contracts audited before mainnet deployment
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.


📧 Contact
Email: kcnipson@gmail.com



