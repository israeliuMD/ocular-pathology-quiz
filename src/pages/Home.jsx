export default function Home() {
  console.log("Home component rendering");
  // The rest of your existing code stays the same
}
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, BookOpen, ListChecks, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-indigo-100 mb-3">
          <Eye className="h-10 w-10 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Ocular Pathology Quiz</h1>
        <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
          Test your knowledge of ocular pathology with interactive quizzes based on textbook images.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard 
          icon={<ListChecks className="h-8 w-8 text-indigo-600" />}
          title="Take Quiz"
          description="Test your knowledge with multiple-choice questions based on ocular pathology images."
          action={<Link to={createPageUrl("Quiz")}><Button className="w-full">Start Quiz</Button></Link>}
        />
        
        <FeatureCard 
          icon={<BookOpen className="h-8 w-8 text-emerald-600" />}
          title="Study Mode"
          description="Review images and explanations at your own pace without being tested."
          action={<Link to={createPageUrl("Study")}><Button variant="outline" className="w-full">Study Images</Button></Link>}
        />
        
        <FeatureCard 
          icon={<BarChart className="h-8 w-8 text-purple-600" />}
          title="Track Progress"
          description="View your performance statistics and identify areas for improvement."
          action={<Link to={createPageUrl("Progress")}><Button variant="outline" className="w-full">View Progress</Button></Link>}
        />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About This Study Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            This interactive quiz app is designed to help you study ocular pathology through image-based multiple-choice questions. 
            The content is based on Chapter 1: Introduction to Part I from your textbook, covering key concepts including:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
            <li>Developmental anomalies such as choristomas and teratomas</li>
            <li>Inflammatory processes and cell identification</li>
            <li>Degenerative conditions including phthisis bulbi</li>
            <li>Neoplastic disease classifications and identification</li>
          </ul>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            The quiz includes questions based on all figures from Chapter 1, designed to test your ability to identify key pathological features.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function FeatureCard({ icon, title, description, action }) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        {action}
      </CardFooter>
    </Card>
  );
}
