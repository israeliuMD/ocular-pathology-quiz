import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Award, BarChart, Calendar, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatDate, calculatePercentage } from "@/lib/utils";
import { formatCategoryName, getPercentageColorClass } from "@/utils";

export default function ProgressPage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState("1");
  const [availableChapters, setAvailableChapters] = useState(["1"]);

  useEffect(() => {
    loadUserData();
  }, [currentChapter]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setUserData(user);
    } catch (error) {
      console.error("Error loading user data:", error);
      // Initialize with empty data if user doesn't have quiz data yet
      setUserData({
        quiz_scores: [],
        categories_progress: {
          developmental_anomaly: { correct: 0, total: 0 },
          inflammation: { correct: 0, total: 0 },
          dystrophy_and_degeneration: { correct: 0, total: 0 },
          neoplasia: { correct: 0, total: 0 }
        },
        total_questions_attempted: 0,
        total_correct: 0
      });
    }
    setIsLoading(false);
  };

  // Calculate progress percentages for categories
  const calculateCategoryProgress = (category) => {
    const categoryData = userData?.categories_progress?.[category];
    if (!categoryData || categoryData.total === 0) return 0;
    return calculatePercentage(categoryData.correct, categoryData.total);
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!userData || userData.total_questions_attempted === 0) return 0;
    return calculatePercentage(userData.total_correct, userData.total_questions_attempted);
  };

  // Use mock data for demonstration in the absence of real user data
  // In a real app, this would come from the user's stored data
  const mockUserData = {
    quiz_scores: [
      { date: new Date(2023, 9, 25).toISOString(), score: 75, total_questions: 12, chapter: "1" },
      { date: new Date(2023, 9, 27).toISOString(), score: 83, total_questions: 12, chapter: "1" },
      { date: new Date(2023, 9, 29).toISOString(), score: 91, total_questions: 12, chapter: "1" },
    ],
    categories_progress: {
      developmental_anomaly: { correct: 7, total: 8 },
      inflammation: { correct: 10, total: 12 },
      dystrophy_and_degeneration: { correct: 6, total: 9 },
      neoplasia: { correct: 5, total: 7 }
    },
    chapter_progress: {
      "1": { correct: 28, total: 36 }
    },
    total_questions_attempted: 36,
    total_correct: 28
  };

  // Use mock data or actual user data
  const displayData = userData && userData.total_questions_attempted > 0 ? userData : mockUserData;

  // Get chapter-specific quiz scores
  const chapterQuizScores = displayData.quiz_scores.filter(
    quiz => quiz.chapter === currentChapter
  );

  // Get chapter-specific progress
  const chapterProgress = displayData.chapter_progress?.[currentChapter] || { correct: 0, total: 0 };
  const chapterPercentage = calculatePercentage(chapterProgress.correct, chapterProgress.total);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mb-4"></div>
        <p className="text-indigo-700 font-medium">Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
        <Button variant="outline" onClick={loadUserData} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Overall Score" 
          value={`${calculateOverallProgress()}%`}
          description={`${displayData.total_correct} correct out of ${displayData.total_questions_attempted}`}
          icon={<Award className="h-8 w-8 text-yellow-500" />}
        />
        
        <StatCard 
          title="Questions Attempted" 
          value={displayData.total_questions_attempted}
          description="Total questions answered"
          icon={<BarChart className="h-8 w-8 text-blue-500" />}
        />
        
        <StatCard 
          title="Last Quiz" 
          value={displayData.quiz_scores.length > 0 
            ? `${displayData.quiz_scores[displayData.quiz_scores.length - 1].score}%` 
            : "N/A"}
          description={displayData.quiz_scores.length > 0 
            ? formatDate(displayData.quiz_scores[displayData.quiz_scores.length - 1].date) 
            : "No quizzes taken yet"}
          icon={<Calendar className="h-8 w-8 text-purple-500" />}
        />
      </div>

      <Tabs defaultValue="categories" className="mb-8">
        <TabsList>
          <TabsTrigger value="categories">Categories Progress</TabsTrigger>
          <TabsTrigger value="history">Quiz History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-indigo-600" />
                Category Performance
              </CardTitle>
              <CardDescription>
                Your performance broken down by pathology category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <CategoryProgress 
                  name="Developmental Anomalies" 
                  progress={calculateCategoryProgress('developmental_anomaly')}
                  correct={displayData.categories_progress.developmental_anomaly.correct}
                  total={displayData.categories_progress.developmental_anomaly.total}
                />
                
                <CategoryProgress 
                  name="Inflammation" 
                  progress={calculateCategoryProgress('inflammation')}
                  correct={displayData.categories_progress.inflammation.correct}
                  total={displayData.categories_progress.inflammation.total}
                />
                
                <CategoryProgress 
                  name="Dystrophy & Degeneration" 
                  progress={calculateCategoryProgress('dystrophy_and_degeneration')}
                  correct={displayData.categories_progress.dystrophy_and_degeneration.correct}
                  total={displayData.categories_progress.dystrophy_and_degeneration.total}
                />
                
                <CategoryProgress 
                  name="Neoplasia" 
                  progress={calculateCategoryProgress('neoplasia')}
                  correct={displayData.categories_progress.neoplasia.correct}
                  total={displayData.categories_progress.neoplasia.total}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Quiz History
              </CardTitle>
              <CardDescription>
                Your past quiz performance and progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chapterQuizScores.length > 0 ? (
                <div className="space-y-4">
                  {chapterQuizScores.map((quiz, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{formatDate(quiz.date)}</span>
                        <span className="font-semibold text-indigo-600">{quiz.score}%</span>
                      </div>
                      <Progress value={quiz.score} className="h-2" />
                      <p className="text-sm text-gray-500 mt-2">
                        {Math.round(quiz.score * quiz.total_questions / 100)} correct out of {quiz.total_questions} questions
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No quiz history available for Chapter {currentChapter}. Take a quiz to see your progress.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium text-gray-700">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function CategoryProgress({ name, progress, correct, total }) {
  const colorClass = getPercentageColorClass(progress);
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-medium">{name}</span>
        <span className={`font-semibold ${colorClass}`}>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-gray-500 mt-1">
        {correct} correct out of {total} questions
      </p>
    </div>
  );
}
