import { ContentItem, Category } from "../types/discover";

// Define categories with theme-appropriate colors
export const CATEGORIES: Category[] = [
  {
    id: "sports",
    name: "Sports & Fitness",
    color: "#ffed4a",
    darkColor: "#4a4520",
    icon: "🏃‍♂️",
  },
  {
    id: "art",
    name: "Arts & Crafts",
    color: "#fff8dc",
    darkColor: "#4a4a30",
    icon: "🎨",
  },
  {
    id: "music",
    name: "Music",
    color: "#ff9999",
    darkColor: "#4a2020",
    icon: "🎵",
  },
  {
    id: "gaming",
    name: "Gaming",
    color: "#b3e6ff",
    darkColor: "#1a3f55",
    icon: "🎮",
  },
  {
    id: "outdoor",
    name: "Outdoor",
    color: "#ccffcc",
    darkColor: "#2a4a2a",
    icon: "🏕️",
  },
  {
    id: "tech",
    name: "Technology",
    color: "#e6ccff",
    darkColor: "#3a2a55",
    icon: "💻",
  },
  {
    id: "food",
    name: "Food & Cooking",
    color: "#ffccb3",
    darkColor: "#4a3020",
    icon: "🍳",
  },
  {
    id: "books",
    name: "Books & Reading",
    color: "#ffd9eb",
    darkColor: "#4a2040",
    icon: "📚",
  },
];

/**
 * Generate sample content data for testing
 *
 * @returns {Array<ContentItem>} Array of content items
 */
export const generateContent = (): ContentItem[] => {
  const content: ContentItem[] = [];

  CATEGORIES.forEach((category) => {
    // Generate video items
    for (let i = 0; i < 3; i++) {
      content.push({
        id: `${category.id}-video-${i}`,
        type: "video",
        thumbnail: `/api/placeholder/420/280`,
        title: `${category.name} Video ${i + 1}`,
        author: `${category.name}Expert`,
        date: `${Math.floor(Math.random() * 24) + 1}h ago`,
        likes: Math.floor(Math.random() * 2000) + 500,
        comments: Math.floor(Math.random() * 200) + 50,
        forks: Math.floor(Math.random() * 100) + 10,
        category: category.id,
        importance: i === 0 ? "high" : i === 1 ? "medium" : "low",
        interestLevel: i === 0 ? 90 : i === 1 ? 75 : 60,
      });
    }

    // Generate audio items
    for (let i = 0; i < 2; i++) {
      content.push({
        id: `${category.id}-audio-${i}`,
        type: "audio",
        thumbnail: `/api/placeholder/120/120`,
        title: `${category.name} Podcast ${i + 1}`,
        description: `Weekly ${category.name} discussions and insights`,
        author: `${category.name}Cast`,
        date: `${Math.floor(Math.random() * 5) + 1}d ago`,
        forks: Math.floor(Math.random() * 50) + 5,
        category: category.id,
        importance: i === 0 ? "medium" : "low",
        interestLevel: i === 0 ? 70 : 50,
      });
    }

    // Generate thread items
    for (let i = 0; i < 3; i++) {
      content.push({
        id: `${category.id}-thread-${i}`,
        type: "thread",
        title: `${category.name} Discussion Thread ${i + 1}`,
        content: `Join the conversation about the latest trends and developments in ${category.name}...`,
        author: `${category.name}Community`,
        date: `${Math.floor(Math.random() * 10) + 1}h ago`,
        likes: Math.floor(Math.random() * 1000) + 200,
        comments: Math.floor(Math.random() * 100) + 20,
        forks: Math.floor(Math.random() * 80) + 5,
        category: category.id,
        importance: i === 0 ? "high" : i === 1 ? "medium" : "low",
        interestLevel: i === 0 ? 85 : i === 1 ? 70 : 55,
      });
    }
  });

  return content;
};
