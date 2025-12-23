"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Building, 
  Users, 
  MessageSquare, 
  FolderOpen, 
  LogOut, 
  Settings,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Activity,
  Calendar,
  Upload,
  X,
  Video,
  LayoutDashboard,
  FileText,
  PieChart,
  Database,
  ThumbsUp,
  ThumbsDown,
  MessageCircle
} from "lucide-react";

interface AdminUser {
  email: string;
  name: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  projectLink?: string;
  category: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("messages");

  // Mock data for demonstration
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      subject: "Project Inquiry",
      message: "I'm interested in developing a web application for my business...",
      createdAt: "2024-01-15",
      read: false
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Mobile App Development",
      message: "Looking for a team to develop a cross-platform mobile app...",
      createdAt: "2024-01-14",
      read: true
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      subject: "Consultation Request",
      message: "Would like to schedule a consultation for a desktop software project...",
      createdAt: "2024-01-13",
      read: false
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with advanced features",
      image: "/placeholder-project.jpg",
      video: "/sample-video.mp4",
      projectLink: "https://example.com",
      category: "web",
      technologies: ["React", "Node.js", "MongoDB"],
      featured: true,
      published: true,
      createdAt: "2024-01-10",
      likes: 42,
      dislikes: 3,
      comments: [
        { id: "1", name: "John Doe", text: "Amazing platform! Very intuitive and fast.", createdAt: "2024-01-15" },
        { id: "2", name: "Jane Smith", text: "Great features and excellent user experience.", createdAt: "2024-01-12" }
      ]
    },
    {
      id: "2",
      title: "Task Management App",
      description: "Collaborative task management for teams",
      image: "/placeholder-project.jpg",
      video: "/sample-video2.mp4",
      category: "web",
      technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
      featured: true,
      published: true,
      createdAt: "2024-01-08",
      likes: 38,
      dislikes: 2,
      comments: [
        { id: "3", name: "Mike Johnson", text: "Perfect for our team collaboration needs.", createdAt: "2024-01-10" }
      ]
    },
    {
      id: "3",
      title: "Fitness Tracker",
      description: "Mobile fitness application with workout tracking",
      image: "/placeholder-project.jpg",
      video: "/sample-video3.mp4",
      category: "mobile",
      technologies: ["React Native", "Redux", "SQLite"],
      featured: false,
      published: true,
      createdAt: "2024-01-05",
      likes: 25,
      dislikes: 1,
      comments: []
    },
    {
      id: "4",
      title: "Desktop Video Editor",
      description: "Professional video editing software with advanced features",
      image: "/placeholder-project.jpg",
      video: "/sample-video4.mp4",
      category: "desktop",
      technologies: ["Electron", "FFmpeg", "React"],
      featured: false,
      published: true,
      createdAt: "2023-12-20",
      likes: 31,
      dislikes: 4,
      comments: [
        { id: "4", name: "Sarah Wilson", text: "Powerful features but could use better documentation.", createdAt: "2023-12-25" }
      ]
    },
    {
      id: "5",
      title: "CRM System",
      description: "Comprehensive customer relationship management system",
      image: "/placeholder-project.jpg",
      video: "/sample-video5.mp4",
      projectLink: "https://example-crm.com",
      category: "web",
      technologies: ["Vue.js", "Laravel", "MySQL"],
      featured: true,
      published: true,
      createdAt: "2023-12-15",
      likes: 47,
      dislikes: 5,
      comments: [
        { id: "5", name: "David Brown", text: "Excellent CRM solution, helped streamline our business processes.", createdAt: "2023-12-18" },
        { id: "6", name: "Lisa Garcia", text: "Great value for money and easy to implement.", createdAt: "2023-12-20" }
      ]
    }
  ]);

  // Project upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "",
    technologies: "",
    videoFile: null as File | null,
    projectLink: "",
    featured: false,
    published: true
  });

  // Project edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    technologies: "",
    projectLink: "",
    featured: false,
    published: true
  });

  // Comments dialog state
  const [viewCommentsDialogOpen, setViewCommentsDialogOpen] = useState(false);
  const [selectedProjectForComments, setSelectedProjectForComments] = useState<Project | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const userData = localStorage.getItem("adminUser");
    
    if (!isLoggedIn || !userData) {
      router.push("/admin/login");
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      setAdminUser(user);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/admin/login");
    }
    
    setIsLoading(false);
  }, [router]);

  // Sync projects data with localStorage
  useEffect(() => {
    const syncProjectsData = () => {
      try {
        const savedProjects = localStorage.getItem('projectsState');
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects);
          console.log('Syncing projects data:', parsedProjects);
          
          // Merge with existing projects, preserving admin-specific data
          setProjects(prevProjects => {
            const mergedProjects = parsedProjects.map((savedProject: Project) => {
              const existingProject = prevProjects.find(p => p.id === savedProject.id);
              return {
                ...savedProject,
                featured: existingProject?.featured || savedProject.featured,
                published: existingProject?.published || savedProject.published,
                // Ensure all required fields are present
                technologies: savedProject.technologies || [],
                comments: savedProject.comments || [],
                likes: savedProject.likes || 0,
                dislikes: savedProject.dislikes || 0
              };
            });
            
            console.log('Merged projects:', mergedProjects);
            return mergedProjects;
          });
        }
      } catch (error) {
        console.error('Error syncing projects data:', error);
      }
    };

    // Initial sync
    syncProjectsData();
    
    // Set up interval for real-time sync
    const interval = setInterval(syncProjectsData, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const markMessageAsRead = (messageId: string) => {
    setContactMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const deleteMessage = (messageId: string) => {
    setContactMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const toggleProjectFeatured = (projectId: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, featured: !project.featured }
          : project
      )
    );
  };

  const toggleProjectPublished = (projectId: string) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, published: !project.published }
          : project
      )
    );
  };

  // Project upload functions
  const handleUploadFormChange = (field: string, value: any) => {
    setUploadForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({
        ...prev,
        videoFile: file
      }));
    }
  };

  const handleProjectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Simulate API call - in real app, this would upload to your server
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newProject: Project = {
        id: Date.now().toString(),
        title: uploadForm.title,
        description: uploadForm.description,
        video: uploadForm.videoFile ? `/videos/${uploadForm.videoFile.name}` : undefined,
        projectLink: uploadForm.projectLink || undefined,
        category: uploadForm.category,
        technologies: uploadForm.technologies.split(',').map(t => t.trim()).filter(t => t),
        featured: uploadForm.featured,
        published: uploadForm.published,
        createdAt: new Date().toISOString()
      };

      setProjects(prev => [newProject, ...prev]);
      setIsUploadModalOpen(false);
      
      // Reset form
      setUploadForm({
        title: "",
        description: "",
        category: "",
        technologies: "",
        videoFile: null,
        projectLink: "",
        featured: false,
        published: true
      });
    } catch (error) {
      console.error("Error uploading project:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Project edit functions
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditForm({
      title: project.title,
      description: project.description,
      category: project.category,
      technologies: project.technologies.join(", "),
      projectLink: project.projectLink || "",
      featured: project.featured,
      published: project.published
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsEditing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedProject: Project = {
        ...editingProject,
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        technologies: editForm.technologies.split(',').map(t => t.trim()).filter(t => t),
        projectLink: editForm.projectLink || undefined,
        featured: editForm.featured,
        published: editForm.published
      };

      setProjects(prev => 
        prev.map(project => 
          project.id === editingProject.id ? updatedProject : project
        )
      );

      setIsEditModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error editing project:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const openCommentsDialog = (project: Project) => {
    setSelectedProjectForComments(project);
    setViewCommentsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const unreadMessages = contactMessages.filter(msg => !msg.read).length;
  const featuredProjects = projects.filter(p => p.featured).length;
  const publishedProjects = projects.filter(p => p.published).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 z-10 transition-colors duration-300">
        <div className="flex flex-col h-full p-8">
          {/* Logo and Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-adminLogin-primary to-adminLogin-secondary rounded-lg flex items-center justify-center">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-adminLogin-primary to-adminLogin-secondary bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Turab Root</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 space-y-3">
            <NavItem 
              icon={<MessageSquare className="w-6 h-6" />} 
              label="Messages" 
              active={activeTab === "messages"}
              onClick={() => setActiveTab("messages")}
            />
            <NavItem 
              icon={<FileText className="w-6 h-6" />} 
              label="Projects" 
              active={activeTab === "projects"}
              onClick={() => setActiveTab("projects")}
            />
            <NavItem 
              icon={<PieChart className="w-6 h-6" />} 
              label="Analytics" 
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
            />
            <NavItem 
              icon={<Database className="w-6 h-6" />} 
              label="Settings" 
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </nav>
          
          {/* Bottom Actions */}
          <div className="space-y-4 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <ThemeToggle />
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full justify-start border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-600/50 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="ml-80 p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-300">
            {activeTab === "messages" && "Contact Messages"}
            {activeTab === "projects" && "Project Management"}
            {activeTab === "analytics" && "Analytics Dashboard"}
            {activeTab === "settings" && "Settings"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">
            {activeTab === "messages" && "Manage and respond to contact form submissions"}
            {activeTab === "projects" && "Manage your portfolio projects and uploads"}
            {activeTab === "analytics" && "Monitor your website performance and user engagement"}
            {activeTab === "settings" && "Configure your admin panel preferences"}
          </p>
        </div>
        
        {/* Stats Cards - REMOVED AS REQUESTED */}

        {/* Content Area */}
        {activeTab === "messages" && (
          <Card className="border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm transition-colors duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                    <MessageSquare className="w-6 h-6 mr-3 text-adminLogin-primary" />
                    Contact Messages
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    {contactMessages.length} total messages ({unreadMessages} unread)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactMessages.map((message) => (
                  <Card key={message.id} className={`${!message.read ? 'border-adminLogin-primary/20 bg-adminLogin-primary/5' : ''} border-gray-200/50 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-adminLogin-primary to-adminLogin-secondary rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {message.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{message.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {message.email} • {new Date(message.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={message.read ? "secondary" : "default"} className={message.read ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" : "bg-adminLogin-primary text-white"}>
                              {message.read ? "Read" : "New"}
                            </Badge>
                          </div>
                          <p className="font-medium mb-2 text-gray-900 dark:text-white">{message.subject}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-6">
                          {!message.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markMessageAsRead(message.id)}
                              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteMessage(message.id)}
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-600/50 transition-colors duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "projects" && (
          <Card className="border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm transition-colors duration-300">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                    <FolderOpen className="w-6 h-6 mr-3 text-adminLogin-primary" />
                    Projects
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    {projects.length} total projects ({publishedProjects} published, {featuredProjects} featured)
                  </CardDescription>
                </div>
                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-adminLogin-primary hover:bg-adminLogin-secondary text-white px-6 py-3 transition-colors duration-300">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">Upload New Project</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                          Add a new project with video and information
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleProjectUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-gray-900 dark:text-white">Project Title</Label>
                            <Input
                              id="title"
                              value={uploadForm.title}
                              onChange={(e) => handleUploadFormChange('title', e.target.value)}
                              className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category" className="text-gray-900 dark:text-white">Category</Label>
                            <Select onValueChange={(value) => handleUploadFormChange('category', value)}>
                              <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors duration-300">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors duration-300">
                                <SelectItem value="web">Web</SelectItem>
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="desktop">Desktop</SelectItem>
                                <SelectItem value="service">Service</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                          <Textarea
                            id="description"
                            value={uploadForm.description}
                            onChange={(e) => handleUploadFormChange('description', e.target.value)}
                            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="technologies" className="text-gray-900 dark:text-white">Technologies (comma-separated)</Label>
                          <Input
                            id="technologies"
                            value={uploadForm.technologies}
                            onChange={(e) => handleUploadFormChange('technologies', e.target.value)}
                            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="video" className="text-gray-900 dark:text-white">Video File</Label>
                          <Input
                            id="video"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileChange}
                            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                          />
                          {uploadForm.videoFile && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Selected: {uploadForm.videoFile.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="projectLink" className="text-gray-900 dark:text-white">Project Link (optional)</Label>
                          <Input
                            id="projectLink"
                            type="url"
                            value={uploadForm.projectLink}
                            onChange={(e) => handleUploadFormChange('projectLink', e.target.value)}
                            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="featured"
                              checked={uploadForm.featured}
                              onChange={(e) => handleUploadFormChange('featured', e.target.checked)}
                              className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-adminLogin-primary focus:ring-adminLogin-primary/50 transition-colors duration-300"
                            />
                            <Label htmlFor="featured" className="text-gray-900 dark:text-white">Featured Project</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="published"
                              checked={uploadForm.published}
                              onChange={(e) => handleUploadFormChange('published', e.target.checked)}
                              className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-adminLogin-primary focus:ring-adminLogin-primary/50 transition-colors duration-300"
                            />
                            <Label htmlFor="published" className="text-gray-900 dark:text-white">Published</Label>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsUploadModalOpen(false)}
                            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-adminLogin-primary hover:bg-adminLogin-secondary text-white transition-colors duration-300"
                            disabled={isUploading}
                          >
                            {isUploading ? "Uploading..." : "Upload Project"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="border-gray-200/50 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                              <Badge variant="outline" className="capitalize border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-adminLogin-primary/50 hover:text-adminLogin-primary/80 transition-colors duration-300">
                                {project.category}
                              </Badge>
                              {project.featured && (
                                <Badge variant="default" className="bg-adminLogin-primary hover:bg-adminLogin-secondary text-white transition-colors duration-300">Featured</Badge>
                              )}
                              {project.published && (
                                <Badge variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 transition-colors duration-300">Published</Badge>
                              )}
                              {project.video && (
                                <Badge variant="outline" className="border-adminLogin-primary hover:border-adminLogin-secondary text-adminLogin-primary hover:text-adminLogin-secondary dark:border-adminLogin-primary/50 dark:hover:border-adminLogin-primary/70 dark:text-adminLogin-primary/80 dark:hover:text-adminLogin-primary/100 transition-colors duration-300">
                                  <Video className="h-3 w-3 mr-1" />
                                  Video
                                </Badge>
                              )}
                              {project.projectLink && (
                                <Badge variant="outline" className="border-green-600 hover:border-green-500 text-green-600 hover:text-green-500 dark:border-green-500 dark:hover:border-green-400 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300">
                                  Live
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              {project.description}
                            </p>
                            {project.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {project.technologies.map((tech, index) => (
                                  <Badge key={index} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 text-xs transition-colors duration-300">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Created: {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant={project.featured ? "default" : "outline"}
                              onClick={() => toggleProjectFeatured(project.id)}
                              className={project.featured 
                                ? "bg-adminLogin-primary hover:bg-adminLogin-secondary text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105" 
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-adminLogin-primary/10 hover:border-adminLogin-primary/50 hover:text-adminLogin-primary dark:hover:bg-adminLogin-primary/20 transition-all duration-300 transform hover:scale-105"
                              }
                            >
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-adminLogin-primary/10 hover:border-adminLogin-primary/50 hover:text-adminLogin-primary dark:hover:bg-adminLogin-primary/20 transition-all duration-300 transform hover:scale-105" onClick={() => openEditModal(project)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setProjects(prev => prev.filter(p => p.id !== project.id));
                              }}
                              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-600 dark:hover:bg-red-500/30 dark:hover:border-red-400/50 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-105"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Project Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Edit Project</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Update project information and settings
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleProjectEdit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title" className="text-gray-900 dark:text-white">Project Title</Label>
                    <Input
                      id="edit-title"
                      value={editForm.title}
                      onChange={(e) => handleEditFormChange('title', e.target.value)}
                      className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category" className="text-gray-900 dark:text-white">Category</Label>
                    <Select onValueChange={(value) => handleEditFormChange('category', value)} value={editForm.category}>
                      <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors duration-300">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-colors duration-300">
                        <SelectItem value="web">Web</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-gray-900 dark:text-white">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-technologies" className="text-gray-900 dark:text-white">Technologies (comma-separated)</Label>
                  <Input
                    id="edit-technologies"
                    value={editForm.technologies}
                    onChange={(e) => handleEditFormChange('technologies', e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-projectLink" className="text-gray-900 dark:text-white">Project Link (optional)</Label>
                  <Input
                    id="edit-projectLink"
                    type="url"
                    value={editForm.projectLink}
                    onChange={(e) => handleEditFormChange('projectLink', e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-adminLogin-primary/50 focus:border-adminLogin-primary/50 transition-colors duration-300"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={editForm.featured}
                      onChange={(e) => handleEditFormChange('featured', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-adminLogin-primary focus:ring-adminLogin-primary/50 transition-colors duration-300"
                    />
                    <Label htmlFor="edit-featured" className="text-gray-900 dark:text-white">Featured Project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-published"
                      checked={editForm.published}
                      onChange={(e) => handleEditFormChange('published', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-adminLogin-primary focus:ring-adminLogin-primary/50 transition-colors duration-300"
                    />
                    <Label htmlFor="edit-published" className="text-gray-900 dark:text-white">Published</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-adminLogin-primary hover:bg-adminLogin-secondary text-white transition-colors duration-300"
                    disabled={isEditing}
                  >
                    {isEditing ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Project Analytics Section */}
              <Card className="border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm transition-colors duration-300">
                <CardHeader className="text-center py-8">
                  <CardTitle className="flex items-center justify-center text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    <PieChart className="h-10 w-10 mr-4 text-adminLogin-primary" />
                    Project Analytics
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Track likes, dislikes, and comments for each project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {projects.map((project, index) => (
                      <div key={project.id} className="relative">
                        {/* Add line between rows except for the last one */}
                        {index < projects.length - 1 && (
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-600/50"></div>
                        )}
                        
                        <div className="bg-gray-100/50 dark:bg-gray-800/20 rounded-lg p-6 transition-colors duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/30">
                          <div className="flex flex-col space-y-4">
                            {/* Project Name and Engagement Rate */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                                {project.title}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement:</span>
                                <span className="text-lg font-bold text-adminLogin-primary dark:text-adminLogin-primary">
                                  {project.likes + project.dislikes > 0 
                                    ? `${Math.round((project.likes / (project.likes + project.dislikes)) * 100)}% positive` 
                                    : 'No engagement'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Feedback Indicators in the Middle */}
                            <div className="flex flex-col items-center justify-center py-4">
                              <div className="flex items-center justify-center space-x-8">
                                <div className="flex flex-col items-center space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <ThumbsUp className="h-6 w-6 text-green-500" />
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{project.likes}</span>
                                  </div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Likes</span>
                                </div>
                                
                                <div className="flex flex-col items-center space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <ThumbsDown className="h-6 w-6 text-red-500" />
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{project.dislikes}</span>
                                  </div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Dislikes</span>
                                </div>
                                
                                <div className="flex flex-col items-center space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <MessageCircle className="h-6 w-6 text-blue-500" />
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{project.comments.length}</span>
                                  </div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Comments</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* View Comments Button */}
                            <div className="flex justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openCommentsDialog(project)}
                                className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-2"
                                disabled={project.comments.length === 0}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                View Comments
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        {activeTab === "settings" && (
            <Card className="border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Settings className="h-6 w-6 mr-3 text-adminLogin-primary" />
                  Settings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Configure your admin panel settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-20 w-20 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Settings panel would be configured here</p>
                </div>
              </CardContent>
            </Card>
          )}

      </main>

      {/* Comments Dialog */}
      <Dialog open={viewCommentsDialogOpen} onOpenChange={setViewCommentsDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50 max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center text-gray-900 dark:text-white">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
              Project Comments - {selectedProjectForComments?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              View all comments for this project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedProjectForComments && selectedProjectForComments.comments.length > 0 ? (
              selectedProjectForComments.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-100/50 dark:bg-gray-800/20 rounded-lg p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{comment.name}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{comment.createdAt}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No comments yet</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">When users comment on this project, they will appear here.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedProjectForComments && (
                  <>
                    <span className="font-medium">{selectedProjectForComments.comments.length}</span> total comments
                  </>
                )}
              </div>
              <Button 
                onClick={() => setViewCommentsDialogOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-200 text-left ${
        active 
          ? 'bg-adminLogin-primary/20 border border-adminLogin-primary/30 text-gray-900 dark:text-white' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <div className={`${active ? 'text-adminLogin-primary' : 'text-gray-500 dark:text-gray-500'}`}>
        {icon}
      </div>
      <span className={`font-medium ${active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
        {label}
      </span>
    </button>
  );
}
