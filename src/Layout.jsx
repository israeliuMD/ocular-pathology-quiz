import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { BookOpen, Home, ListChecks, BarChart, Menu, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";

// Utility function to create page URL
const createPageUrl = (page) => {
  return `/${page.toLowerCase()}`;
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const currentPath = location.pathname.substring(1) || 'home';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-800">Ocular Pathology Quiz</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <NavLink 
              to="Home" 
              icon={<Home className="w-5 h-5" />} 
              active={currentPath.toLowerCase() === 'home'}
              onClick={() => setSidebarOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="Quiz" 
              icon={<ListChecks className="w-5 h-5" />} 
              active={currentPath.toLowerCase() === 'quiz'}
              onClick={() => setSidebarOpen(false)}
            >
              Take Quiz
            </NavLink>
            <NavLink 
              to="Progress" 
              icon={<BarChart className="w-5 h-5" />} 
              active={currentPath.toLowerCase() === 'progress'}
              onClick={() => setSidebarOpen(false)}
            >
              Progress
            </NavLink>
            <NavLink 
              to="Study" 
              icon={<BookOpen className="w-5 h-5" />} 
              active={currentPath.toLowerCase() === 'study'}
              onClick={() => setSidebarOpen(false)}
            >
              Study Mode
            </NavLink>
          </div>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="text-xs text-gray-500 text-center">
            <p>Ocular Pathology Study App</p>
            <p>Chapter 1 - Introduction to Part I</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold text-indigo-800">Ocular Pathology Quiz</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, icon, active, onClick, children }) {
  return (
    <Link
      to={createPageUrl(to)}
      className={cn(
        "flex items-center px-3 py-2 rounded-md transition-colors",
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
      )}
      onClick={onClick}
    >
      <span className="mr-3 text-indigo-600">{icon}</span>
      {children}
    </Link>
  );
}
