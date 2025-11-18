# 🎉 SignPlay - AI-Powered Sign Language Learning Platform

An interactive web application that uses AI gesture recognition to teach sign language through gamification and real-time feedback.

![SignPlay Banner](https://img.shields.io/badge/SignPlay-AI%20Learning-016B61?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

## ✨ Features

### 🤖 AI Gesture Recognition
- Real-time hand tracking using MediaPipe
- K-Nearest Neighbors (KNN) model for accurate predictions
- Recognizes numbers 0-9 through hand gestures
- Local processing - no external dependencies

### 🎮 Interactive Game System
- 10-question math quiz format
- Automatic question progression
- Real-time gesture capture
- Confetti celebrations for correct answers
- Motivational feedback system
- Live score tracking

### 📊 Comprehensive Dashboard
- Real-time statistics and progress tracking
- Accuracy trend charts
- Success rate visualizations
- Recent games history
- Performance summaries

### 📚 Educational Resources
- Professional ASL gesture guide
- Individual number descriptions
- Learning tips and practice guidelines
- Interactive gesture testing

### 🔐 Secure Authentication
- JWT-based user authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Persistent user sessions

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Webcam** - Camera integration

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### ML Service
- **Python Flask** - ML API server
- **MediaPipe** - Hand tracking
- **scikit-learn** - KNN model
- **OpenCV** - Image processing
- **NumPy** - Numerical operations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MongoDB Atlas** account (or local MongoDB)
- **npm** or **yarn** package manager

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ShivamSaxena0078/signplay-final.git
cd signplay-final
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Install ML Service Dependencies
```bash
cd ml_service
pip install -r requirements.txt
cd ..
```

### 5. Configure Environment Variables

#### Frontend (.env)
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

#### Backend (server/.env)
Create a `server/.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
PORT=8080
```

**Important**: 
- Replace `your_mongodb_connection_string` with your MongoDB Atlas connection string
- Replace `your_secure_random_string` with a secure random string (at least 32 characters)
- Never commit these files to Git!

## 🚀 Running the Application

You need to run three services simultaneously:

### Terminal 1: Frontend (Next.js)
```bash
npm run dev
```
Runs on: http://localhost:3000

### Terminal 2: Backend (Node.js)
```bash
cd server
npm start
```
Runs on: http://localhost:8080

### Terminal 3: ML Service (Flask)
```bash
cd ml_service
python app.py
```
Runs on: http://localhost:5001

## 📱 Application Pages

- **Homepage** (`/`) - Landing page
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration
- **Game** (`/game`) - Interactive quiz game
- **Dashboard** (`/dashboard`) - Statistics and progress
- **Gesture Guide** (`/gesture-guide`) - Learning resources
- **Gesture Test** (`/gesture-test`) - Practice and testing

## 🎯 How to Use

1. **Sign Up** - Create a new account
2. **Login** - Access your account
3. **Learn** - Visit the Gesture Guide to learn hand gestures
4. **Practice** - Use the Gesture Test page to practice
5. **Play** - Start a game and answer math questions using gestures
6. **Track Progress** - View your statistics on the Dashboard

## 🗄️ Database Schema

### GameSession
Stores complete game session information:
- User ID, start/end times
- Total questions, correct/incorrect counts
- Average accuracy, total score
- Dexterity score

### GameQuestionResponse
Stores individual question responses:
- User ID, game ID reference
- Question details and answers
- Response time, confidence
- Accuracy and correctness

### User
Stores user account information:
- Name, email, hashed password
- Total games played
- Average accuracy
- Dexterity score

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ JWT tokens with 7-day expiry
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation

## 🎨 Design System

### Color Palette
- **Primary**: `#016B61` (Deep Teal)
- **Secondary**: `#70B2B2` (Soft Teal)
- **Accent**: `#9ECFD4` (Light Blue)
- **Background**: `#E5E9C5` (Cream)

### Typography
- **Font**: Montserrat (300-900 weights)
- **Hierarchy**: Consistent weight distribution
- **Style**: Clean, modern, professional

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Game Management
- `POST /api/game/start-session` - Create game session
- `POST /api/game/save-question` - Save question response
- `POST /api/game/complete-session` - Finalize session
- `GET /api/game/stats` - Get user statistics

### Gesture Recognition
- `POST /api/gesture/predict` - Predict gesture from image

### Health Check
- `GET /api/health` - System status

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network connectivity

### ML Service Not Starting
- Install all Python dependencies: `pip install -r ml_service/requirements.txt`
- Check Python version (3.8+)
- Verify MediaPipe installation

### Authentication Errors
- Clear browser localStorage
- Logout and login again
- Check JWT_SECRET in server/.env

### Webcam Not Working
- Allow camera permissions in browser
- Check if camera is being used by another application
- Try a different browser

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Shivam Saxena**
- GitHub: [@ShivamSaxena0078](https://github.com/ShivamSaxena0078)

## 🙏 Acknowledgments

- MediaPipe for hand tracking technology
- MongoDB Atlas for database hosting
- Next.js team for the amazing framework
- All contributors and testers

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Built with ❤️ using modern web technologies and AI**

*Last Updated: November 18, 2025*
