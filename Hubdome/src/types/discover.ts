// Define the content types enum
export type ContentType = "video" | "audio" | "thread";

// Interface for the content items
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  author: string;
  date: string;
  category: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  likes?: number;
  comments?: number;
  forks: number;
  importance?: "high" | "medium" | "low";
  interestLevel?: number;
  ranking?: number;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  color: string;
  darkColor?: string;
  icon: string;
}

// Props for each of the main view components
export interface GridViewProps {
  content: ContentItem[];
  selectedCategory: string;
  activeTab: "forYou" | "trending" | "nearYou"; // Updated to include "nearYou"
  contentFilter: ContentType | "all";
  searchQuery: string;
  onItemPress: (item: ContentItem) => void;
  onFork: (item: ContentItem) => void;
}

export interface CanvasViewProps {
  content: ContentItem[];
  selectedCategory: string;
  searchQuery: string;
  onCategorySelect: (categoryId: string) => void;
  onItemPress: (item: ContentItem) => void;
  onFork: (item: ContentItem) => void;
}

export interface ForkBoardViewProps {
  forkedContent: ContentItem[];
  onItemPress: (item: ContentItem) => void;
}

export interface ForkedContent {
  id: string;
  title: string;
  thumbnail?: string;
  author: string;
  date: string;
  type: string;
  category?: string;
  reactions: {
    inspired: number;
    curious: number;
    excited: number;
    [key: string]: number;
  };
  comments: Comment[];
  forks: number;
  collaborators: Collaborator[];
  heritage: Heritage[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
}

export interface Heritage {
  id: string;
  title: string;
  date: string;
}

export interface ContentDetailModalProps {
  visible: boolean;
  item: ContentItem | null;
  onClose: () => void;
  onFork: (item: ContentItem) => void;
}

export interface StickyNoteProps {
  item: ContentItem;
  position: { x: number, y: number };
  rotationAngle?: number;
  isHighlighted?: boolean;
  onPress: (item: ContentItem) => void;
}

export interface VideoCardProps {
  item: ContentItem;
  onPress: (item: ContentItem) => void;
  onFork: (item: ContentItem) => void;
}

export interface AudioCardProps {
  item: ContentItem;
  onPress: (item: ContentItem) => void;
  onFork: (item: ContentItem) => void;
}

export interface ThreadCardProps {
  item: ContentItem;
  onPress: (item: ContentItem) => void;
  onFork: (item: ContentItem) => void;
}

export interface DiscoverHeaderProps {
  currentTab: "discover" | "forkBoard";
  showSearchBar: boolean;
  onToggleSearchBar: () => void;
  onToggleViewMode: () => void;
  onToggleCurrentTab: () => void;
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCancel: () => void;
}

export interface TabsBarProps {
  activeTab: "forYou" | "trending" | "nearYou"; // Updated to include "nearYou"
  onTabChange: (tab: "forYou" | "trending" | "nearYou") => void; 
}

export interface FilterBarProps {
  contentFilter: ContentType | "all";
  onFilterChange: (filter: ContentType | "all") => void;
}

// HappeningNearYou props
export interface HappeningNearYouProps {
  onItemPress: (item: ContentItem) => void;
  onFork: (item: ContentItem) => void;
}