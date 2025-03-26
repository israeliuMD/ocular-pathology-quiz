export default function Quiz() {
  console.log("Quiz component rendering");
  
  // Add this to your loadQuestions function
  async function loadQuestions() {
    console.log("loadQuestions called - trying to load questions");
    setIsLoading(true);
    try {
      // Your existing code
      console.log("Successfully loaded questions:", chapterQuestions);
    } catch (error) {
      console.error("Error in loadQuestions:", error);
    }
    setIsLoading(false);
  }
  
  // The rest of your existing code stays the same
}
import React, { useState, useEffect } from "react";
import { Question } from "@/entities/Question";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, ArrowRight, Check, CheckCircle2, XCircle, 
  AlertCircle, RefreshCw, Flag
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formatCategoryName } from "@/utils";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState("1");
  const [availableChapters, setAvailableChapters] = useState(["1"]);

  useEffect(() => {
    loadQuestions();
  }, [currentChapter]);

  useEffect(() => {
    // Reset states when changing questions
    setSelectedOption(null);
    setShowAnswer(false);
  }, [currentQuestionIndex]);

  async function loadQuestions() {
    setIsLoading(true);
    try {
      // In a real app, we would load available chapters from an API
      // For now, we'll just use a hardcoded list
      setAvailableChapters(["1"]);

      // Load questions for the current chapter
      const chapterQuestions = await Question.getByChapter(currentChapter);
      if (chapterQuestions && chapterQuestions.length > 0) {
        setQuestions(chapterQuestions);
      } else {
        // Fallback to the CSV data
        const data = await Question.list();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      // Fallback to the CSV data
      try {
        const data = await Question.list();
        setQuestions(data);
      } catch (fallbackError) {
        console.error("Error loading fallback questions:", fallbackError);
      }
    }
    setIsLoading(false);
  }

  const filterQuestions = () => {
    if (filter === "all") return questions;
    return questions.filter(q => q.category === filter);
  };

  const sortQuestions = (filteredQuestions) => {
    switch (sortOrder) {
      case "figure_asc":
        return [...filteredQuestions].sort((a, b) => {
          const figA = a.figure_number?.replace(/[^0-9.-]+/g, "") || "0";
          const figB = b.figure_number?.replace(/[^0-9.-]+/g, "") || "0";
          return parseFloat(figA) - parseFloat(figB);
        });
      case "difficulty_asc":
        return [...filteredQuestions].sort((a, b) => {
          const diffOrder = { easy: 1, medium: 2, hard: 3 };
          return diffOrder[a.difficulty || 'medium'] - diffOrder[b.difficulty || 'medium'];
        });
      case "difficulty_desc":
        return [...filteredQuestions].sort((a, b) => {
          const diffOrder = { easy: 1, medium: 2, hard: 3 };
          return diffOrder[b.difficulty || 'medium'] - diffOrder[a.difficulty || 'medium'];
        });
      case "random":
        return [...filteredQuestions].sort(() => Math.random() - 0.5);
      default:
        return filteredQuestions;
    }
  };

  const filteredAndSortedQuestions = sortQuestions(filterQuestions());
  const currentQuestion = filteredAndSortedQuestions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (!selectedOption) return;
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: selectedOption
    });
    
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredAndSortedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      saveQuizResults();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setSelectedOption(null);
    setShowAnswer(false);
  };

  const saveQuizResults = async () => {
    const score = calculateScore();
    
    // Group results by category
    const categories = {};
    
    Object.keys(userAnswers).forEach(qId => {
      const question = questions.find(q => q.id === qId);
      if (!question) return;
      
      const category = question.category || 'uncategorized';
      
      if (!categories[category]) {
        categories[category] = { correct: 0, total: 0 };
      }
      
      categories[category].total++;
      
      if (userAnswers[qId] === question.correct_answer) {
        categories[category].correct++;
      }
    });
    
    const categoryResults = Object.keys(categories).map(category => ({
      category,
      correct: categories[category].correct,
      total: categories[category].total
    }));
    
    const results = {
      percentage: score.percentage,
      correct: score.correct,
      total: score.total,
      categoryResults,
      chapter: currentChapter
    };
    
    await User.saveQuizResults(results);
  };

  const calculateScore = () => {
    let correct = 0;
    Object.keys(userAnswers).forEach(qId => {
      const question = questions.find(q => q.id === qId);
      if (question && userAnswers[qId] === question.correct_answer) {
        correct++;
      }
    });
    return {
      correct,
      total: Object.keys(userAnswers).length,
      percentage: Math.round((correct / Object.keys(userAnswers).length) * 100) || 0
    };
  };

  const getImageUrl = (question) => {
    // If the question has a full image URL, use that
    if (question.image_url && question.image_url.startsWith('http')) {
      return question.image_url;
    }
    
    // Otherwise, construct the URL based on chapter and figure number
    return Question.getImageUrl(question);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mb-4"></div>
        <p className="text-indigo-700 font-medium">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Questions Available</h2>
        <p className="text-gray-600 mb-6">There are no questions available for the selected chapter. Please check back later or select a different chapter.</p>
        <Button onClick={loadQuestions} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
    );
  }

  if (quizCompleted) {
    const score = calculateScore();
    
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-6">Quiz Completed!</h2>
          
          <div className="mb-8">
            <div className="text-5xl font-bold text-indigo-600 mb-2">{score.percentage}%</div>
            <p className="text-gray-600">You answered {score.correct} out of {score.total} questions correctly</p>
          </div>
          
          <div className="space-y-4">
            <Button onClick={restartQuiz} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" /> Restart Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ocular Pathology Quiz</h1>
          <p className="text-gray-600">
            Chapter {currentChapter}: Question {currentQuestionIndex + 1} of {filteredAndSortedQuestions.length}
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="developmental_anomaly">Developmental</SelectItem>
              <SelectItem value="inflammation">Inflammation</SelectItem>
              <SelectItem value="dystrophy_and_degeneration">Degeneration</SelectItem>
              <SelectItem value="neoplasia">Neoplasia</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Order</SelectItem>
              <SelectItem value="figure_asc">By Figure Number</SelectItem>
              <SelectItem value="difficulty_asc">Easy to Hard</SelectItem>
              <SelectItem value="difficulty_desc">Hard to Easy</SelectItem>
              <SelectItem value="random">Random</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Progress value={(currentQuestionIndex / filteredAndSortedQuestions.length) * 100} className="mb-6" />

      {currentQuestion && (
        <Card className="p-6 mb-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              {currentQuestion.figure_number && (
                <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                  Figure {currentQuestion.figure_number}
                </span>
              )}
              
              {currentQuestion.category && (
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                  {formatCategoryName(currentQuestion.category)}
                </span>
              )}
            </div>
            
            <h2 className="text-xl font-semibold mb-4">{currentQuestion.question_text}</h2>
            
            {currentQuestion.image_url && (
              <div className="mb-6 flex justify-center">
                <img 
                  src={getImageUrl(currentQuestion)}
                  alt={`Figure ${currentQuestion.figure_number}`} 
                  className="max-h-72 object-contain rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/400/300";
                  }}
                />
              </div>
            )}
          </div>

          <RadioGroup 
            value={selectedOption} 
            onValueChange={setSelectedOption}
            disabled={showAnswer}
            className="space-y-3"
          >
            <AnswerOption 
              value="A" 
              text={currentQuestion.option_a} 
              showAnswer={showAnswer} 
              correctAnswer={currentQuestion.correct_answer}
            />
            <AnswerOption 
              value="B" 
              text={currentQuestion.option_b} 
              showAnswer={showAnswer} 
              correctAnswer={currentQuestion.correct_answer}
            />
            <AnswerOption 
              value="C" 
              text={currentQuestion.option_c} 
              showAnswer={showAnswer} 
              correctAnswer={currentQuestion.correct_answer}
            />
            <AnswerOption 
              value="D" 
              text={currentQuestion.option_d} 
              showAnswer={showAnswer} 
              correctAnswer={currentQuestion.correct_answer}
            />
          </RadioGroup>

          {showAnswer && (
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-600" />
                Explanation
              </h3>
              <p className="mt-2 text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </Card>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevQuestion} 
          disabled={currentQuestionIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        
        <div className="space-x-3">
          {!showAnswer ? (
            <Button onClick={handleAnswerSubmit} disabled={!selectedOption} className="gap-2">
              <Check className="h-4 w-4" /> Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="gap-2 bg-green-600 hover:bg-green-700">
              {currentQuestionIndex === filteredAndSortedQuestions.length - 1 ? (
                <>Complete Quiz <Flag className="h-4 w-4 ml-1" /></>
              ) : (
                <>Next Question <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function AnswerOption({ value, text, showAnswer, correctAnswer }) {
  const isCorrect = value === correctAnswer;
  const isSelected = showAnswer && value === correctAnswer;
  
  return (
    <div 
      className={`flex items-start space-x-2 p-3 rounded-md border ${
        showAnswer 
          ? isCorrect 
            ? "bg-green-50 border-green-200" 
            : value === showAnswer 
              ? "bg-red-50 border-red-200" 
              : "border-gray-200"
          : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      <RadioGroupItem value={value} id={`option-${value}`} />
      <div className="flex-1">
        <Label htmlFor={`option-${value}`} className="flex">
          <span className="font-medium mr-2">{value}.</span>
          <span>{text}</span>
        </Label>
      </div>
      {showAnswer && isCorrect && (
        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
      )}
      {showAnswer && !isCorrect && value === showAnswer && (
        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      )}
    </div>
  );
}
