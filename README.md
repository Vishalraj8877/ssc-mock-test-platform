# SSC Smart Mock Test Platform

A production-ready, full-stack mock test platform for SSC exams, featuring AI-powered question extraction, intelligent test generation, and comprehensive analytics.

## 🌟 Features

### Core Features
- ✅ Complete user authentication with JWT & refresh tokens
- ✅ Role-based access control (Student, Admin, Super Admin)
- ✅ 4 subjects with 20+ topics covering SSC curriculum
- ✅ Automated PDF question extraction with OCR support
- ✅ AI-powered question classification and categorization
- ✅ Smart mock test generation (Random, Topic-wise, Subject-wise, Full-length)
- ✅ Real-time countdown timer and full-screen mode
- ✅ Negative marking and detailed result analysis
- ✅ Student performance analytics with charts
- ✅ Daily/Weekly/Monthly leaderboards
- ✅ Question bookmarking with collections
- ✅ Advanced search and filtering
- ✅ Responsive design with dark mode support

### AI & Automation
- 📄 PDF text extraction and processing
- 🔍 OCR for scanned PDFs (Tesseract)
- 🤖 Automatic question detection and parsing
- 🏷️ Subject and topic auto-classification
- 📊 Difficulty level estimation
- 🎯 Smart question bank management

## 📋 Tech Stack

### Frontend
- **Framework:** React.js 18+
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3
- **Charts:** Chart.js with React Chart.js
- **HTTP Client:** Axios
- **State Management:** Context API + Custom Hooks
- **UI Components:** Headless UI, React Icons

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Authentication:** JWT with Refresh Tokens
- **Database:** MongoDB with Mongoose ODM
- **File Upload:** Multer
- **PDF Processing:** pdf-parse
- **OCR:** Tesseract.js
- **Validation:** Joi
- **Security:** Helmet, CORS, Rate Limiting
- **Environment:** Dotenv

### Database
- **Primary:** MongoDB Atlas
- **ODM:** Mongoose 7+
- **Indexing:** For performance optimization

### DevOps & Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **File Storage:** AWS S3 (configurable)

## 📁 Project Structure

```
ssc-mock-test-platform/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── TestInterface/
│   │   │   ├── Admin/
│   │   │   └── Common/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── validators/
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── .gitignore
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables
# MONGODB_URI=your_mongodb_url
# JWT_SECRET=your_secret_key

npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Subjects & Topics

### Quantitative Aptitude
- Percentage, Profit and Loss, Ratio, Average
- Time and Work, Time Speed Distance
- Number System, Simplification, Algebra, Geometry

### Reasoning
- Analogy, Coding Decoding, Blood Relation
- Direction, Series, Puzzle

### English
- Grammar, Vocabulary, Cloze Test, Reading Comprehension

### General Awareness
- History, Geography, Polity, Economy, Science, Current Affairs

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Rate limiting on API endpoints
- Input validation and sanitization
- XSS protection
- CSRF tokens
- Secure password reset flow

## 📈 Analytics & Reporting

- Subject-wise performance breakdown
- Topic-wise accuracy analysis
- Monthly progress tracking
- Time management insights
- Comparison with peers (leaderboard)
- Downloadable scorecards and reports

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Render)
- Connect GitHub repository
- Set environment variables
- Deploy from dashboard

### Database (MongoDB Atlas)
- Create cluster
- Configure security groups
- Generate connection string

## 📚 API Documentation

See [API.md](./docs/API.md) for complete API documentation including:
- Authentication endpoints
- Question management APIs
- Test creation and submission
- Analytics and leaderboard
- Admin operations

## 🗄️ Database Schema

See [DATABASE.md](./docs/DATABASE.md) for complete MongoDB schema design including:
- User model (with roles)
- Question model
- Test model
- Result model
- Leaderboard model
- Bookmark model
- And more...

## 🏗️ Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system architecture details including:
- API design patterns
- Data flow diagrams
- Security architecture
- Scalability considerations

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_S3_BUCKET=
```

## 👥 User Roles

### Student
- Attempt mock tests
- View results and analytics
- Bookmark questions
- Check leaderboard
- Download scorecards

### Admin
- Create and manage tests
- Upload questions via PDF
- Bulk import questions
- Manage student accounts
- View platform analytics

### Super Admin
- All admin privileges
- Manage admin accounts
- System-level configuration
- Override permissions

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📦 Build & Deployment

```bash
# Backend build
cd backend
npm run build

# Frontend build
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For support, email support@sscmocktest.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Live doubt sessions
- [ ] AI-powered answer explanations
- [ ] Adaptive difficulty testing
- [ ] Video lecture integration
- [ ] Peer discussion forums
- [ ] Scholarship matching system

## 👨‍💻 Author

**Vishal Raj**
- GitHub: [@Vishalraj8877](https://github.com/Vishalraj8877)

---

**Last Updated:** May 2026
**Version:** 1.0.0
