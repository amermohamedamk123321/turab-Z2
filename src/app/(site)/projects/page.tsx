"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, ExternalLink, Calendar, Code, Video, ThumbsUp, ThumbsDown, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DarkVeilLazy from "@/components/DarkVeilLazy";
import DeferredComponent from "@/components/DeferredComponent";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { initialProjects, type Project, type Comment } from "@/data/projects";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function ProjectsPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [userInteractions, setUserInteractions] = useLocalStorage<{[key: string]: {liked: boolean, disliked: boolean, commented: boolean}}>('projectInteractions', {});
  const [projectsState, setProjectsState] = useLocalStorage<Project[]>('projectsState', initialProjects);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedProjectForComment, setSelectedProjectForComment] = useState<string | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [viewCommentsDialogOpen, setViewCommentsDialogOpen] = useState(false);
  const [selectedProjectForViewComments, setSelectedProjectForViewComments] = useState<string | null>(null);

  const featuredProjects = useMemo(() => projectsState.filter(project => project.featured), [projectsState]);
  const regularProjects = useMemo(() => projectsState.filter(project => !project.featured), [projectsState]);

  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const handleLike = (projectId: string) => {
    const interactions = userInteractions[projectId];
    
    // If user already liked, do nothing
    if (interactions?.liked) {
      return;
    }
    
    // Get current project state
    const currentProject = projectsState.find(p => p.id === projectId);
    if (!currentProject) return;
    
    // If user disliked, remove dislike and add like
    const newLikes = interactions?.disliked ? currentProject.likes + 1 : currentProject.likes + 1;
    const newDislikes = interactions?.disliked ? currentProject.dislikes - 1 : currentProject.dislikes;
    
    setProjectsState(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, likes: newLikes, dislikes: newDislikes }
        : project
    ));
    
    // Update user interactions
    setUserInteractions(prev => ({
      ...prev,
      [projectId]: { 
        liked: true, 
        disliked: false, 
        commented: interactions?.commented || false 
      }
    }));
    
    // Save to localStorage
    saveToLocalStorage();
  };

  const handleDislike = (projectId: string) => {
    const interactions = userInteractions[projectId];
    
    // If user already disliked, do nothing
    if (interactions?.disliked) {
      return;
    }
    
    // Get current project state
    const currentProject = projectsState.find(p => p.id === projectId);
    if (!currentProject) return;
    
    // If user liked, remove like and add dislike
    const newLikes = interactions?.liked ? currentProject.likes - 1 : currentProject.likes;
    const newDislikes = interactions?.liked ? currentProject.dislikes + 1 : currentProject.dislikes + 1;
    
    setProjectsState(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, likes: newLikes, dislikes: newDislikes }
        : project
    ));
    
    // Update user interactions
    setUserInteractions(prev => ({
      ...prev,
      [projectId]: { 
        liked: false, 
        disliked: true, 
        commented: interactions?.commented || false 
      }
    }));
    
    // Save to localStorage
    saveToLocalStorage();
  };

  const handleCommentSubmit = () => {
    if (!selectedProjectForComment || !commentName.trim() || !commentText.trim()) {
      return;
    }

    const interactions = userInteractions[selectedProjectForComment];
    
    // If user already commented, do nothing
    if (interactions?.commented) {
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      name: commentName.trim(),
      text: commentText.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjectsState(prev => prev.map(project => 
      project.id === selectedProjectForComment 
        ? { ...project, comments: [...project.comments, newComment] }
        : project
    ));

    // Mark user as having commented on this project
    setUserInteractions(prev => ({
      ...prev,
      [selectedProjectForComment]: { 
        liked: interactions?.liked || false, 
        disliked: interactions?.disliked || false, 
        commented: true 
      }
    }));

    // Save to localStorage
    saveToLocalStorage();

    // Reset form and close dialog
    setCommentName("");
    setCommentText("");
    setCommentDialogOpen(false);
    setSelectedProjectForComment(null);
  };

  const openCommentDialog = (projectId: string) => {
    setSelectedProjectForComment(projectId);
    setCommentDialogOpen(true);
  };

  const openViewCommentsDialog = (projectId: string) => {
    setSelectedProjectForViewComments(projectId);
    setViewCommentsDialogOpen(true);
  };

  // localStorage functions
  const saveToLocalStorage = () => {
    console.log('Saving to localStorage:', { userInteractions, projectsState });
    localStorage.setItem('projectInteractions', JSON.stringify(userInteractions));
    localStorage.setItem('projectsState', JSON.stringify(projectsState));
  };

  const loadFromLocalStorage = () => {
    try {
      const savedInteractions = localStorage.getItem('projectInteractions');
      const savedProjects = localStorage.getItem('projectsState');
      
      console.log('Loading from localStorage:', { savedInteractions, savedProjects });
      
      if (savedInteractions) {
        setUserInteractions(JSON.parse(savedInteractions));
      }
      
      if (savedProjects) {
        setProjectsState(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      {/* Hero Section with DarkVeil */}
      <section className="relative h-screen">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <DeferredComponent fallback={<SkeletonLoader className="w-full h-full bg-slate-900" />}>
            <DarkVeilLazy
              hueShift={60}
              noiseIntensity={0}
              scanlineIntensity={0}
              speed={1}
              scanlineFrequency={5}
              warpAmount={5}
            />
          </DeferredComponent>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center z-10">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-thin mb-6 text-white tracking-widest" style={{ fontFamily: '"Poppins", "Inter", "Quicksand", "Nunito", "Rubik", sans-serif' }}>
              Our Projects
            </h1>
            <p className="text-xl md:text-2xl font-thin text-white/90 tracking-wider max-w-3xl mx-auto" style={{ fontFamily: '"Inter", "Quicksand", "Nunito", sans-serif' }}>
              The creativity of our works are higher than competition's potential
            </p>
          </div>
        </div>
      </section>

      {/* Top Best Projects */}
      {featuredProjects.length > 0 && (
        <section className="px-4 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: '#f8fafc' }}>
                Top Best Projects
              </h2>
              <div className="w-20 sm:w-24 h-1 mx-auto" style={{ backgroundColor: '#328e6e' }}></div>
            </div>
            <div className="grid gap-8 md:gap-12 lg:gap-16">
              {featuredProjects.map((project) => (
                <div key={project.id} className="group">
                  <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-center">
                    {/* Left side - Video/Image */}
                    <div className="w-full lg:w-1/2 relative">
                      <div className="aspect-video rounded-lg md:rounded-2xl overflow-hidden bg-gray-800 relative">
                        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#90c67c' }}>
                          <div className="text-center text-white">
                            <div className="text-6xl mb-4">🎬</div>
                            <p className="text-lg">Project Preview</p>
                          </div>
                        </div>
                        
                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="lg"
                                className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-[#328e6e] hover:text-[#328e6e] shadow-lg transform hover:scale-110 transition-all duration-300"
                                onClick={() => handlePlayVideo(project.video || '')}
                              >
                                <Play className="h-8 w-8" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-black border-none p-0">
                              <div className="aspect-video bg-black flex items-center justify-center">
                                <div className="text-center text-white">
                                  <div className="text-6xl mb-4">🎥</div>
                                  <p className="text-lg">Video Player</p>
                                  <p className="text-sm text-gray-400 mt-2">
                                    {project.title} - Video Demo
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Details */}
                    <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-3 md:mb-4" style={{ color: '#f8fafc' }}>
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 md:gap-3">
                        <Badge className="capitalize px-3 md:px-4 py-1 md:py-2 text-sm md:text-base" style={{ backgroundColor: '#328e6e', color: '#f8fafc', border: 'none' }}>
                          {project.category}
                        </Badge>
                        {project.featured && (
                          <Badge className="bg-yellow-500 text-black border-none px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-semibold">
                            Best
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-300 leading-relaxed text-sm md:text-lg">
                        {project.description}
                      </p>

                      {/* Like, Dislike, and Comment Buttons */}
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLike(project.id)}
                          className={`flex items-center gap-2 ${userInteractions[project.id]?.liked ? 'bg-green-500 text-white border-green-500' : 'border-green-500 text-green-400 hover:bg-green-500 hover:text-white'}`}
                          disabled={userInteractions[project.id]?.disliked}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{project.likes}</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDislike(project.id)}
                          className={`flex items-center gap-2 ${userInteractions[project.id]?.disliked ? 'bg-red-500 text-white border-red-500' : 'border-red-500 text-red-400 hover:bg-red-500 hover:text-white'}`}
                          disabled={userInteractions[project.id]?.liked}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span>{project.dislikes}</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCommentDialog(project.id)}
                          className={`flex items-center gap-2 ${userInteractions[project.id]?.commented ? 'bg-blue-500 text-white border-blue-500' : 'border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white'}`}
                          disabled={userInteractions[project.id]?.commented}
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Comment</span>
                        </Button>


                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: '#f8fafc' }}>
              All Projects
            </h2>
            <div className="w-20 sm:w-24 h-1 mx-auto" style={{ backgroundColor: '#328e6e' }}></div>
          </div>
          <div className="grid gap-8 md:gap-12 lg:gap-16">
            {regularProjects.map((project) => (
              <div key={project.id} className="group">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-center">
                  {/* Left side - Video/Image */}
                  <div className="w-full lg:w-1/2 relative">
                    <div className="aspect-video rounded-lg md:rounded-2xl overflow-hidden bg-gray-800 relative">
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: '#90c67c' }}>
                        <div className="text-center text-white">
                          <div className="text-6xl mb-4">🎬</div>
                          <p className="text-lg">Project Preview</p>
                        </div>
                      </div>
                      
                      {/* Play button overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="lg"
                              className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-[#328e6e] hover:text-[#328e6e] shadow-lg transform hover:scale-110 transition-all duration-300"
                              onClick={() => handlePlayVideo(project.video || '')}
                            >
                              <Play className="h-8 w-8" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl bg-black border-none p-0">
                            <div className="aspect-video bg-black flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="text-6xl mb-4">🎥</div>
                                <p className="text-lg">Video Player</p>
                                <p className="text-sm text-gray-400 mt-2">
                                  {project.title} - Video Demo
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Details */}
                  <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-3 md:mb-4" style={{ color: '#f8fafc' }}>
                      {project.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <Badge className="capitalize px-3 md:px-4 py-1 md:py-2 text-sm md:text-base" style={{ backgroundColor: '#328e6e', color: '#f8fafc', border: 'none' }}>
                        {project.category}
                      </Badge>
                      {project.featured && (
                        <Badge className="bg-yellow-500 text-black border-none px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-semibold">
                          Best
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-300 leading-relaxed text-sm md:text-lg">
                      {project.description}
                    </p>

                    {/* Like, Dislike, and Comment Buttons */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(project.id)}
                        className={`flex items-center gap-2 ${userInteractions[project.id]?.liked ? 'bg-green-500 text-white border-green-500' : 'border-green-500 text-green-400 hover:bg-green-500 hover:text-white'}`}
                        disabled={userInteractions[project.id]?.disliked}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{project.likes}</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDislike(project.id)}
                        className={`flex items-center gap-2 ${userInteractions[project.id]?.disliked ? 'bg-red-500 text-white border-red-500' : 'border-red-500 text-red-400 hover:bg-red-500 hover:text-white'}`}
                        disabled={userInteractions[project.id]?.liked}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>{project.dislikes}</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCommentDialog(project.id)}
                        className={`flex items-center gap-2 ${userInteractions[project.id]?.commented ? 'bg-blue-500 text-white border-blue-500' : 'border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white'}`}
                        disabled={userInteractions[project.id]?.commented}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Comment</span>
                      </Button>

                      {/* View Comments Button */}
                      {project.comments.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewCommentsDialog(project.id)}
                          className="flex items-center gap-2 border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>View ({project.comments.length})</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #328e6e 0%, #67ae6e 50%, #90c67c 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <Button 
            size="lg" 
            className="text-lg px-12 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#328e6e' }}
            asChild
          >
            <Link href="/contact" prefetch={true}>Start Your Project</Link>
          </Button>
        </div>
      </section>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Add a Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">Name</Label>
              <Input
                id="name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your name"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="comment" className="text-sm font-medium text-gray-300">Comment</Label>
              <Textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Your comment..."
                rows={4}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCommentDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCommentSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!commentName.trim() || !commentText.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Comments Dialog */}
      <Dialog open={viewCommentsDialogOpen} onOpenChange={setViewCommentsDialogOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Project Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedProjectForViewComments && (() => {
              const project = projectsState.find(p => p.id === selectedProjectForViewComments);
              if (!project || project.comments.length === 0) {
                return (
                  <div className="text-center text-gray-400 py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                );
              }
              return project.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{comment.name}</h4>
                    <span className="text-sm text-gray-400">{comment.createdAt}</span>
                  </div>
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              ));
            })()}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setViewCommentsDialogOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
