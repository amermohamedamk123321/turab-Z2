export interface Project {
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

export interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export const initialProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform with real-time inventory management, AI-powered recommendations, and seamless payment integration. Built with scalability and performance in mind, this platform handles thousands of concurrent users and provides an exceptional shopping experience.",
    image: "/placeholder-project.jpg",
    video: "/sample-video.mp4",
    projectLink: "https://example-ecommerce.com",
    category: "web",
    technologies: ["Next.js", "TypeScript", "Prisma", "Stripe", "Tailwind CSS", "Redis"],
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
    description: "Collaborative task management application with real-time updates, team analytics, and intuitive project tracking. Features include drag-and-drop interface, time tracking, team collaboration tools, and comprehensive reporting dashboard.",
    image: "/placeholder-project.jpg",
    video: "/sample-video2.mp4",
    category: "web",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Express", "JWT"],
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
    title: "Fitness Tracker Mobile",
    description: "Cross-platform mobile app for tracking fitness goals with social features and progress analytics. Includes workout planning, nutrition tracking, social challenges, and integration with wearable devices for comprehensive health monitoring.",
    image: "/placeholder-project.jpg",
    video: "/sample-video3.mp4",
    category: "mobile",
    technologies: ["React Native", "Firebase", "Redux", "Expo", "HealthKit", "Google Fit"],
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
    description: "Professional video editing software with advanced features and intuitive user interface. Supports multiple formats, real-time effects, color grading, audio editing, and export optimization for various platforms.",
    image: "/placeholder-project.jpg",
    video: "/sample-video4.mp4",
    category: "desktop",
    technologies: ["Electron", "FFmpeg", "React", "TypeScript", "WebGL", "WebAssembly"],
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
    description: "Comprehensive customer relationship management system for small to medium businesses. Features include contact management, sales pipeline tracking, email integration, reporting analytics, and automated workflow management.",
    image: "/placeholder-project.jpg",
    video: "/sample-video5.mp4",
    projectLink: "https://example-crm.com",
    category: "web",
    technologies: ["Vue.js", "Laravel", "MySQL", "Docker", "Elasticsearch", "Redis"],
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
];