# Ocular Pathology Quiz Application

An interactive learning tool for studying ocular pathology through image-based multiple-choice questions.

## Features

- **Quiz Mode**: Test your knowledge with multiple-choice questions based on ocular pathology images
- **Study Mode**: Review images and explanations at your own pace
- **Progress Tracking**: Monitor your performance and identify areas for improvement
- **Chapter-based Content**: Organized by textbook chapters for structured learning
- **Category Filtering**: Filter questions by pathology categories
- **Image Zoom**: Zoom in/out on pathology images for detailed study

## Project Structure

```
ocular-pathology-quiz/
├── public/                  # Public assets
│   └── favicon.ico          # Favicon
├── src/                     # Source code
│   ├── components/          # Reusable UI components
│   │   └── ui/              # Base UI components 
│   ├── entities/            # Data models
│   │   ├── Question.js      # Question entity
│   │   └── User.js          # User entity for progress tracking
│   ├── lib/                 # Library utilities
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Home page
│   │   ├── Quiz.jsx         # Quiz page
│   │   ├── Study.jsx        # Study mode page
│   │   └── Progress.jsx     # Progress tracking page
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles
│   ├── App.jsx              # Main application component
│   ├── Layout.jsx           # Main layout component
│   └── index.jsx            # Application entry point
└── data/                    # Data files
    ├── chapters/            # Chapter-specific data
    │   └── chapter1/        # Chapter 1 data
    │       ├── questions.json # Chapter 1 questions
    │       └── images/      # Chapter 1 images
    └── questions.csv        # Original questions data
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ocular-pathology-quiz.git
   cd ocular-pathology-quiz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at: http://localhost:5173

## Adding Images

To add images for each chapter:

1. Create a folder for the chapter if it doesn't exist:
   ```
   data/chapters/chapter{number}/images/
   ```

2. Add image files using the naming convention:
   ```
   figure_{number}.jpg
   ```
   For example: `figure_1_1.jpg`, `figure_1_2.jpg`, etc.

3. Update the questions JSON file for the chapter:
   ```
   data/chapters/chapter{number}/questions.json
   ```

## Adding New Chapters

To add a new chapter:

1. Create a new directory:
   ```
   data/chapters/chapter{number}/
   ```

2. Create an `images` subdirectory:
   ```
   data/chapters/chapter{number}/images/
   ```

3. Create a `questions.json` file with the chapter's questions:
   ```
   data/chapters/chapter{number}/questions.json
   ```

4. Update the UI to include the new chapter in the chapter selection options.

## Technologies Used

- **React**: Frontend library
- **React Router**: For navigation
- **TailwindCSS**: For styling
- **Vite**: Build tool and development server
- **Lucide React**: Icon library
- **LocalStorage**: For storing user progress

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Images and content are based on standard ocular pathology educational materials
- Created for educational purposes only
