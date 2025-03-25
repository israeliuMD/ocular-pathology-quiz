import React, { useState, useEffect } from "react";
import { Question } from "@/entities/Question";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BookOpen,
  AlertCircle, CircleDot, Eye, RefreshCw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCategoryName } from "@/utils";

export default function Study() {
  const [questions, setQuestions] = useState([]);
  const [currentFigureIndex, setCurrentFigureIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentChapter, setCurrentChapter] = useState("1");
  const [availableChapters, setAvailableChapters] = useState(["1"]);

  useEffect(() => {
    loadQuestions();
  }, [currentChapter]);

  async function loadQuestions() {
    setIsLoading(true);
    try {
      // In a real app, we would load available chapters from an API
      // For now, we'll just use a hardcoded list
      setAvailableChapters(["1"]);

      // Load questions for the current chapter
      const chapterQuestions = await Question.getByChapter(currentChapter);
      if (chapterQuestions && chapterQuestions.length > 0) {
        // Sort by figure number
        const sorted = [...chapterQuestions].sort((a, b) => {
          const figA = a.figure_number?.replace(/[^0-9.-]+/g, "") || "0";
          const figB = b.figure_number?.replace(/[^0-9.-]+/g, "") || "0";
          return parseFloat(figA) - parseFloat(figB);
        });
        setQuestions(sorted);
      } else {
        // Fallback to the CSV data
        const data = await Question.list();
        const sorted = [...data].sort((a, b) => {
          const figA = a.figure_number?.replace(/[^0-9.-]+/g, "") || "0";
          const figB = b.figure_number?.replace(/[^0-9.-]+/g, "") || "0";
          return parseFloat(figA) - parseFloat(figB);
        });
        setQuestions(sorted);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      // Fallback to the CSV data
      try {
        const data = await Question.list();
        const sorted = [...data].sort((a, b) => {
          const figA = a.figure_number?.replace(/[^0-9.-]+/g, "") || "0";
          const figB = b.figure_number?.replace(/[^0-9.-]+/g, "") || "0";
          return parseFloat(figA) - parseFloat(figB);
        });
        setQuestions(sorted);
      } catch (fallbackError) {
        console.error("Error loading fallback questions:", fallbackError);
      }
    }
    setIsLoading(false);
  }

  const filteredQuestions = currentCategory === "all" 
    ? questions 
    : questions.filter(q => q.category === currentCategory);

  const currentFigure = filteredQuestions[currentFigureIndex];

  const handleNext = () => {
    if (currentFigureIndex < filteredQuestions.length - 1) {
      setCurrentFigureIndex(currentFigureIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFigureIndex > 0) {
      setCurrentFigureIndex(currentFigureIndex - 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 60));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const handleCategoryChange = (value) => {
    setCurrentCategory(value);
    setCurrentFigureIndex(0);
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
        <p className="text-indigo-700 font-medium">Loading study materials...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Study Materials Available</h2>
        <p className="text-gray-600 mb-6">There are no study materials available for the selected chapter. Please check back later or select a different chapter.</p>
        <Button onClick={loadQuestions} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Study Mode</h1>
        
        <div className="mb-6">
          <Tabs defaultValue="all" value={currentCategory} onValueChange={handleCategoryChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Figures</TabsTrigger>
              <TabsTrigger value="developmental_anomaly">Developmental</TabsTrigger>
              <TabsTrigger value="inflammation">Inflammation</TabsTrigger>
              <TabsTrigger value="dystrophy_and_degeneration">Degeneration</TabsTrigger>
              <TabsTrigger value="neoplasia">Neoplasia</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            Figure {currentFigureIndex + 1} of {filteredQuestions.length}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 60}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetZoom}>
              {zoomLevel}%
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {currentFigure && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Figure {currentFigure.figure_number}
              </CardTitle>
              
              {currentFigure.category && (
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                  {formatCategoryName(currentFigure.category)}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            <div className="overflow-auto max-w-full">
              <img 
                src={getImageUrl(currentFigure)}
                alt={`Figure ${currentFigure.figure_number}`} 
                style={{ 
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease'
                }}
                className="max-h-80 object-contain mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/api/placeholder/400/300";
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-0">
            <div className="mb-4">
              <h3 className="font-semibold flex items-center mb-2">
                <CircleDot className="mr-2 h-4 w-4 text-indigo-600" />
                Description
              </h3>
              <p className="text-gray-700">{currentFigure.question_text}</p>
            </div>
            
            <div>
              <h3 className="font-semibold flex items-center mb-2">
                <Eye className="mr-2 h-4 w-4 text-indigo-600" />
                Key Points
              </h3>
              <p className="text-gray-700">{currentFigure.explanation}</p>
            </div>
          </CardFooter>
        </Card>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious} 
          disabled={currentFigureIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Previous Figure
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleNext} 
          disabled={currentFigureIndex === filteredQuestions.length - 1}
          className="flex items-center gap-2"
        >
          Next Figure <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
