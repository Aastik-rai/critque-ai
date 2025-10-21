# Critique AI - Personal Development Assistant

An AI-powered personal development app that creates personalized daily plans based on user goals and tracks progress with confidence ratings.

## Features

- **Personal Assessment**: Comprehensive questionnaire to understand user goals, fitness level, and preferences
- **AI-Generated Plans**: Personalized daily plans created using OpenAI GPT
- **Confidence Tracking**: Dynamic confidence scoring that increases/decreases based on task completion
- **Progress Analytics**: Visual charts and statistics to track improvement over time
- **Modern UI**: Beautiful, responsive interface built with Material-UI and React

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- OpenAI GPT-3.5 for plan generation
- JWT authentication
- RESTful API design

### Frontend
- React 18 with TypeScript
- Material-UI for components
- React Router for navigation
- Recharts for data visualization
- Axios for API calls

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd critique-ai
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/critique-ai
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   ```

5. **Start the application**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start individually
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

### Database Setup

The app uses MongoDB. Make sure MongoDB is running on your system or use a cloud service like MongoDB Atlas.

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file
3. The app will use GPT-3.5-turbo for plan generation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Assessment
- `GET /api/assessment/questions` - Get assessment questions
- `POST /api/assessment/submit` - Submit assessment responses

### Plans
- `GET /api/plans/today` - Get today's plan
- `POST /api/plans/generate` - Generate new plan
- `PATCH /api/plans/tasks/:taskId` - Update task completion
- `GET /api/plans/history` - Get plan history

### Progress
- `GET /api/progress` - Get progress data
- `POST /api/progress/submit` - Submit daily progress
- `GET /api/progress/confidence` - Get confidence trend
- `GET /api/progress/stats` - Get completion statistics

## How It Works

1. **User Registration**: Users create an account and complete a comprehensive assessment
2. **AI Plan Generation**: Based on assessment responses, the AI generates personalized daily plans
3. **Task Management**: Users can view and complete tasks, with real-time progress tracking
4. **Confidence Scoring**: The system tracks confidence levels and adjusts based on task completion
5. **Progress Analytics**: Visual charts show improvement over time

## Key Features

### Assessment Flow
- Multi-step questionnaire covering goals, fitness level, available time, and challenges
- Dynamic confidence score calculation based on responses
- Personalized plan generation using AI

### Daily Planning
- AI-generated tasks tailored to user goals and capabilities
- Priority-based task organization
- Time estimation for each task
- Category-based task grouping (fitness, career, health, etc.)

### Progress Tracking
- Real-time confidence score updates
- Completion rate tracking
- Streak counting
- Visual progress charts
- Achievement recognition

## Customization

### Adding New Question Types
Edit `routes/assessment.js` to add new question types to the assessment flow.

### Modifying AI Prompts
Update the prompt templates in `services/aiService.js` to customize plan generation.

### UI Theming
Modify the Material-UI theme in `client/src/index.tsx` to customize colors and styling.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository or contact the development team.
