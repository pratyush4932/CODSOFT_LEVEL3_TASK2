# Project Management Application

A modern, feature-rich project management application built with React, featuring a Kanban board, AI-powered task generation, comprehensive project tracking, and user authentication.

## Features

### 🔐 Authentication & Security
- **User Login System**: Secure login with email and password validation
- **Session Management**: Persistent login state with localStorage
- **User Profile**: Display user information and logout functionality
- **Demo Account**: Pre-configured demo credentials for testing

### 🎯 Core Functionality
- **Dashboard View**: Overview of all projects with progress tracking and status badges
- **Kanban Board**: Three-column task management (To Do, In Progress, Done)
- **Drag & Drop**: Intuitive task status updates via drag and drop
- **Project Management**: Create, view, and manage multiple projects
- **Task Management**: Add, edit, and delete tasks with assignee and due date tracking

### 🤖 AI Integration
- **Gemini API Integration**: AI-powered task generation based on project goals
- **Smart Task Suggestions**: Automatically generate relevant tasks for your projects
- **Batch Task Addition**: Select and add multiple AI-generated tasks at once

### 🎨 Modern UI/UX
- **Bootstrap 5**: Responsive design with modern styling
- **Lucide React Icons**: Beautiful, consistent iconography
- **Interactive Modals**: Smooth user experience for all operations
- **Progress Tracking**: Visual progress bars and status indicators
- **Gradient Backgrounds**: Modern visual appeal with CSS gradients

## Technology Stack

- **Frontend**: React 18 with Hooks (useState, useEffect)
- **Styling**: Bootstrap 5 (CDN) + Custom CSS
- **Icons**: Lucide React
- **Drag & Drop**: React Beautiful DnD
- **State Management**: React Hooks
- **Authentication**: Local storage-based session management
- **API**: Native Fetch API (ready for Gemini API integration)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

5. **Login with demo credentials**
   - Email: `demo@projectmanager.com`
   - Password: `demo123`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginPage.js    # User authentication page
│   ├── Header.js       # Navigation, project selector, and user menu
│   ├── Dashboard.js    # Main project overview
│   ├── KanbanBoard.js  # Kanban board with drag & drop
│   ├── NewProjectModal.js # Project creation modal
│   ├── NewTaskModal.js # Task creation/editing modal
│   └── AITaskModal.js  # AI task generation modal
├── data/
│   └── mockData.js     # Sample projects and tasks
├── App.js              # Main application component with auth logic
├── index.js            # Application entry point
└── index.css           # Global styles and custom CSS
```

## Usage

### Authentication
1. **Login**: Enter your email and password, or use the demo account
2. **Session Persistence**: Your login state is automatically saved
3. **Logout**: Use the user menu in the header to sign out

### Creating a New Project
1. Click the "New Project" button in the header
2. Fill in the project name and description
3. Click "Create Project"

### Managing Tasks
1. Navigate to a project's Kanban board
2. Use "New Task" to create individual tasks
3. Drag and drop tasks between columns to update status
4. Edit or delete tasks using the dropdown menu on each task card

### AI Task Generation
1. In the Kanban board, click "Generate with AI"
2. Describe your project goal
3. Review and select generated tasks
4. Add selected tasks to your project

## API Integration

### Gemini API Setup (Optional)
The application includes a mock AI task generation system. To integrate with the actual Gemini API:

1. **Get API Key**: Obtain your Gemini API key from Google AI Studio
2. **Update API Call**: Replace the mock function in `App.js` with actual API calls
3. **Environment Variables**: Store your API key securely

Example API integration:
```javascript
const generateAITasks = async (goal) => {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Generate 5 tasks for this project goal: ${goal}. Return as JSON array with format: [{"content": "task description"}]`
        }]
      }]
    })
  });
  
  const data = await response.json();
  // Parse and return the generated tasks
  return JSON.parse(data.candidates[0].content.parts[0].text);
};
```

### Authentication Backend Integration
To integrate with a real authentication backend:

1. **Update Login Handler**: Replace the mock authentication in `LoginPage.js`
2. **JWT Tokens**: Implement JWT token storage and validation
3. **API Calls**: Add authentication headers to all API requests
4. **Route Protection**: Implement proper route guards for protected pages

## Customization

### Styling
- Modify `src/index.css` for custom styles
- Update Bootstrap theme variables for consistent theming
- Add custom CSS classes for specific components
- Customize login page gradients and colors

### Data Structure
- Update `src/data/mockData.js` to modify initial data
- Extend project and task models as needed
- Add new status types or custom fields
- Implement user roles and permissions

### Authentication
- Add user registration functionality
- Implement password reset features
- Add multi-factor authentication
- Create user profile management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Features

- **Input Validation**: Form validation for all user inputs
- **XSS Protection**: Sanitized user input handling
- **Session Management**: Secure session storage
- **Password Requirements**: Minimum password length enforcement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React and modern web technologies**
