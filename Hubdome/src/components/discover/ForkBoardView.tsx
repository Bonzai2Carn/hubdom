// src/components/discover/ForkBoardView.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Surface, Chip, Badge, Avatar, Divider } from "react-native-paper";
import { ForkBoardViewProps, ContentItem, ForkedContent, Comment, Collaborator, Heritage} from "../../types/discover";

const { width } = Dimensions.get("window");

// Enhanced ForkBoardView with community focus
const ForkBoardView: React.FC<ForkBoardViewProps> = ({
  forkedContent,
  onItemPress,
}) => {
  // State for animations and interactions
  const [activeFilter, setActiveFilter] = useState("all");
  const [commentInput, setCommentInput] = useState("");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [showCollaborators, setShowCollaborators] = useState(false);
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const challengeAnim = useRef(new Animated.Value(0)).current;
  const collabAnim = useRef(new Animated.Value(0)).current;
  
  // Enhance content with community data
  const enhancedContent = forkedContent.map(item => ({
    ...item,
    comments: [
      {
        id: `comment-${item.id}-1`,
        author: "Sarah Lee",
        text: "This is exactly what I've been looking for! Can't wait to join the next session.",
        timestamp: "2h ago",
        likes: 7
      },
      {
        id: `comment-${item.id}-2`,
        author: "John Doe",
        text: "Great resource! Has anyone tried the techniques mentioned here?",
        timestamp: "5h ago",
        likes: 3
      }
    ],
    reactions: {
      inspired: 12,
      curious: 8,
      excited: 15
    },
    collaborators: [
      { id: "user1", name: "Emily Chen", avatar: null, role: "Creator" },
      { id: "user2", name: "Alex Johnson", avatar: null, role: "Contributor" },
      { id: "user3", name: "Maria Garcia", avatar: null, role: "Contributor" }
    ],
    heritage: [
      { id: "original", title: "Original idea by Emily Chen", date: "Apr 12" },
      { id: "fork1", title: "Expanded by Alex Johnson", date: "Apr 15" },
      { id: "fork2", title: "Current version", date: "Apr 19" }
    ]
  }));
  
  // Mock community challenges
  const communityChallenges = [
    {
      id: "challenge1",
      title: "30-Day Photography Challenge",
      description: "Take one themed photo every day for 30 days.",
      participants: 143,
      daysLeft: 12,
      category: "Photography",
      color: "#F97316"
    },
    {
      id: "challenge2",
      title: "Weekly Cooking Exchange",
      description: "Cook a dish and share it with the community.",
      participants: 87,
      daysLeft: 3,
      category: "Cooking",
      color: "#EF4444"
    },
    {
      id: "challenge3",
      title: "Code Something New",
      description: "Learn a new programming concept and build a small project.",
      participants: 56,
      daysLeft: 5,
      category: "Technology",
      color: "#3B82F6"
    }
  ];
  
  // Filter content
  const getFilteredContent = () => {
    if (activeFilter === "all") return enhancedContent;
    return enhancedContent.filter(item => item.type === activeFilter);
  };
  
  // Helper to get icon for content type
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "video": return "videocam";
      case "audio": return "headset";
      case "thread": return "forum";
      default: return "description";
    }
  };
  
  // Helper to get label for content type
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "video": return "Video";
      case "audio": return "Audio";
      case "thread": return "Discussion";
      default: return "Content";
    }
  };
  
  // Toggle expanded item for comments
  const toggleItemExpansion = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
    
    // Reset other UI states
    setIsAddingComment(false);
    setShowCollaborators(false);
    
    // Reset animations
    slideAnim.setValue(0);
    collabAnim.setValue(0);
  };
  
  // Toggle input for adding comment
  const toggleAddComment = () => {
    setIsAddingComment(!isAddingComment);
    
    Animated.timing(slideAnim, {
      toValue: isAddingComment ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };
  
  // Toggle collaborators view
  const toggleCollaboratorsView = () => {
    setShowCollaborators(!showCollaborators);
    
    Animated.timing(collabAnim, {
      toValue: showCollaborators ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };
  
  // Toggle challenge details
  const toggleChallengeDetails = (id: string) => {
    const newId = activeChallengeId === id ? null : id;
    setActiveChallengeId(newId);
    
    Animated.timing(challengeAnim, {
      toValue: newId ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };
  
  // Submit a comment
  const submitComment = () => {
    if (!commentInput.trim()) return;
    
    // In a real app, this would call an API
    console.log(`Submitting comment: ${commentInput} for item: ${expandedItemId}`);
    
    // Reset state
    setCommentInput("");
    setIsAddingComment(false);
    slideAnim.setValue(0);
  };
  
  // Join a challenge
  const joinChallenge = (challengeId: string) => {
    // In a real app, this would call an API
    console.log(`Joining challenge: ${challengeId}`);
    
    // Show success feedback
    alert("You've joined the challenge! You'll receive daily prompts in your notifications.");
  };
  
  // Render filter tabs
  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "all" && styles.activeFilterTab
          ]}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && styles.activeFilterText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "video" && styles.activeFilterTab
          ]}
          onPress={() => setActiveFilter("video")}
        >
          <MaterialIcons
            name="videocam"
            size={16}
            color={activeFilter === "video" ? "#FFFFFF" : "#BBBBBB"}
            style={styles.filterIcon}
          />
          <Text
            style={[
              styles.filterText,
              activeFilter === "video" && styles.activeFilterText
            ]}
          >
            Videos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "audio" && styles.activeFilterTab
          ]}
          onPress={() => setActiveFilter("audio")}
        >
          <MaterialIcons
            name="headset"
            size={16}
            color={activeFilter === "audio" ? "#FFFFFF" : "#BBBBBB"}
            style={styles.filterIcon}
          />
          <Text
            style={[
              styles.filterText,
              activeFilter === "audio" && styles.activeFilterText
            ]}
          >
            Audio
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "thread" && styles.activeFilterTab
          ]}
          onPress={() => setActiveFilter("thread")}
        >
          <MaterialIcons
            name="forum"
            size={16}
            color={activeFilter === "thread" ? "#FFFFFF" : "#BBBBBB"}
            style={styles.filterIcon}
          />
          <Text
            style={[
              styles.filterText,
              activeFilter === "thread" && styles.activeFilterText
            ]}
          >
            Discussions
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
  
  // Render community challenges section
  const renderCommunityChallenges = () => (
    <View style={styles.challengesContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Community Challenges</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
          <MaterialIcons name="chevron-right" size={18} color="#3498DB" />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.challengesList}
      >
        {communityChallenges.map(challenge => (
          <TouchableOpacity
            key={challenge.id}
            style={[
              styles.challengeCard,
              activeChallengeId === challenge.id && styles.activeChallengeCard
            ]}
            onPress={() => toggleChallengeDetails(challenge.id)}
          >
            <View style={[styles.challengeColorBar, { backgroundColor: challenge.color }]} />
            
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              
              <View style={styles.challengeStats}>
                <View style={styles.challengeStat}>
                  <MaterialIcons name="people" size={14} color="#BBBBBB" />
                  <Text style={styles.challengeStatText}>
                    {challenge.participants} participating
                  </Text>
                </View>
                
                <View style={styles.challengeStat}>
                  <MaterialIcons name="timer" size={14} color="#BBBBBB" />
                  <Text style={styles.challengeStatText}>
                    {challenge.daysLeft} days left
                  </Text>
                </View>
              </View>
              
              {activeChallengeId === challenge.id && (
                <Animated.View
                  style={[
                    styles.challengeDetails,
                    {
                      opacity: challengeAnim,
                      transform: [
                        {
                          translateY: challengeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <Text style={styles.challengeDescription}>
                    {challenge.description}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.joinChallengeButton}
                    onPress={() => joinChallenge(challenge.id)}
                  >
                    <MaterialIcons name="add-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.joinChallengeText}>Join Challenge</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  // Render an individual content item
  const renderContentItem = ({ item, index }: { item: any; index: number }) => {
    const isExpanded = expandedItemId === item.id;
    const isFirstItem = index === 0;
    
    return (
      <Surface style={[styles.contentCard, isFirstItem && styles.featuredCard]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onItemPress(item)}
        >
          {item.thumbnail && (
            <Image
              source={{ uri: item.thumbnail }}
              style={[
                styles.contentImage,
                isFirstItem && styles.featuredImage
              ]}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.contentMeta}>
            <View style={styles.contentHeader}>
              <Text
                style={[
                  styles.contentTitle,
                  isFirstItem && styles.featuredTitle
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {isFirstItem && (
                <View style={styles.featuredBadge}>
                  <MaterialIcons name="star" size={12} color="#FFFFFF" />
                  {" Top Pick"}
                </View>
              )}
            </View>
            
            <View style={styles.authorRow}>
              <Avatar.Text
                size={24}
                label={item.author.charAt(0)}
                color="#FFFFFF"
                style={{ backgroundColor: "#3498DB" }}
              />
              <Text style={styles.authorName}>{item.author}</Text>
              <Text style={styles.contentDate}>{item.date}</Text>
            </View>
            
            <View style={styles.tagsRow}>
              <Chip
                style={styles.typeChip}
                textStyle={styles.typeChipText}
                icon={() => (
                  <MaterialIcons
                    name={item.type === "location" ? "place" : "note"}
                    size={16}
                    color="#FFFFFF"
                  />
                )}
              >
                {getTypeLabel(item.type)}
              </Chip>
              
              {item.category && (
                <Chip
                  style={styles.categoryChip}
                  textStyle={styles.chipText}
                >
                  {item.category}
                </Chip>
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Heritage and lineage tracker */}
        <View style={styles.heritageTracker}>
          {item.heritage.map((stage: Heritage, i: number) => (
            <React.Fragment key={stage.id}>
              <View style={styles.heritageStage}>
                <View style={styles.heritagePoint} />
                <Text style={styles.heritageText}>{stage.title}</Text>
                <Text style={styles.heritageDate}>{stage.date}</Text>
              </View>
              {i < item.heritage.length - 1 && <View style={styles.heritageLine} />}
            </React.Fragment>
          ))}
        </View>
        
        <View style={styles.reactionsBar}>
          <View style={styles.reactionCounter}>
            <MaterialIcons name="insert-emoticon" size={18} color="#FFCA28" />
            <Text style={styles.reactionCount}>
              {Object.values(item.reactions as Record<string, number>).reduce((a, b) => a + b, 0).toString()}
            </Text>
          </View>
          
          <View style={styles.commentCounter}>
            <MaterialIcons name="chat-bubble-outline" size={18} color="#3498DB" />
            <Text style={styles.commentCount}>{item.comments.length}</Text>
          </View>
          
          <View style={styles.shareCounter}>
            <MaterialIcons name="share" size={18} color="#2ECC71" />
            <Text style={styles.shareCount}>{item.forks}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.collaboratorsButton}
            onPress={toggleCollaboratorsView}
          >
            <MaterialIcons name="people" size={18} color="#9B59B6" />
            <Text style={styles.collaboratorsCount}>{item.collaborators.length}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => toggleItemExpansion(item.id)}
          >
            <MaterialIcons
              name={isExpanded ? "expand-less" : "expand-more"}
              size={24}
              color="#BBBBBB"
            />
          </TouchableOpacity>
        </View>
        
        {/* Collaborators view */}
        {isExpanded && showCollaborators && (
          <Animated.View
            style={[
              styles.collaboratorsView,
              {
                opacity: collabAnim,
                transform: [
                  {
                    translateY: collabAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <Text style={styles.collaboratorsTitle}>Collaborators</Text>
            
            {item.collaborators.map((collaborator: Collaborator) => (
  <View key={collaborator.id} style={styles.collaboratorItem}>
    <Avatar.Text
      size={36}
      label={collaborator.name.charAt(0)}
      color="#FFFFFF"
      style={styles.collaboratorAvatar}
    />
    <View style={styles.collaboratorInfo}>
      <Text style={styles.collaboratorName}>{collaborator.name}</Text>
      <Text style={styles.collaboratorRole}>{collaborator.role}</Text>
    </View>
    <TouchableOpacity style={styles.followButton}>
      <Text style={styles.followButtonText}>Follow</Text>
    </TouchableOpacity>
  </View>
))}
            
            <TouchableOpacity style={styles.inviteButton}>
              <MaterialIcons name="person-add" size={16} color="#FFFFFF" />
              <Text style={styles.inviteButtonText}>Invite Collaborator</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        {/* Expanded content with comments and reactions */}
        {isExpanded && !showCollaborators && (
          <View style={styles.expandedContent}>
            <View style={styles.reactionButtons}>
              <TouchableOpacity style={styles.reactionButton}>
                <MaterialIcons name="emoji-emotions" size={20} color="#FFCA28" />
                <Text style={styles.reactionButtonText}>Inspired</Text>
                <Text style={styles.reactionButtonCount}>{item.reactions.inspired}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.reactionButton}>
                <MaterialIcons name="lightbulb" size={20} color="#3498DB" />
                <Text style={styles.reactionButtonText}>Curious</Text>
                <Text style={styles.reactionButtonCount}>{item.reactions.curious}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.reactionButton}>
                <MaterialIcons name="local-fire-department" size={20} color="#FF7F50" />
                <Text style={styles.reactionButtonText}>Excited</Text>
                <Text style={styles.reactionButtonCount}>{item.reactions.excited}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.commentsSection}>
              <Text style={styles.commentsHeader}>
                Comments ({item.comments.length})
              </Text>
              
              {item.comments.map((comment: any) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Avatar.Text
                    size={32}
                    label={comment.author.charAt(0)}
                    color="#FFFFFF"
                    style={styles.commentAvatar}
                  />
                  
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTime}>{comment.timestamp}</Text>
                    </View>
                    
                    <Text style={styles.commentText}>{comment.text}</Text>
                    
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentAction}>
                        <MaterialIcons name="thumb-up-off-alt" size={16} color="#BBBBBB" />
                        <Text style={styles.commentActionText}>
                          Like ({comment.likes})
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.commentAction}>
                        <MaterialIcons name="reply" size={16} color="#BBBBBB" />
                        <Text style={styles.commentActionText}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity
                style={styles.addCommentButton}
                onPress={toggleAddComment}
              >
                <MaterialIcons name="add-comment" size={18} color="#3498DB" />
                <Text style={styles.addCommentText}>Add a comment</Text>
              </TouchableOpacity>
              
              {/* Animated comment input */}
              <Animated.View
                style={[
                  styles.commentInputContainer,
                  {
                    opacity: slideAnim,
                    maxHeight: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1000]
                    }),
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }
                    ]
                  }
                ]}
              >
                <TextInput
                  style={styles.commentInput}
                  placeholder="Share your thoughts..."
                  placeholderTextColor="#BBBBBB"
                  value={commentInput}
                  onChangeText={setCommentInput}
                  multiline
                />
                <View style={styles.commentInputActions}>
                  <TouchableOpacity 
                    style={styles.cancelCommentButton}
                    onPress={toggleAddComment}
                  >
                    <Text style={styles.cancelCommentText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.submitCommentButton,
                      !commentInput.trim() && styles.disabledButton
                    ]}
                    onPress={submitComment}
                    disabled={!commentInput.trim()}
                  >
                    <Text style={styles.submitCommentText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </View>
        )}
      </Surface>
    );
  };
  
  // Render empty state when no content
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <MaterialIcons name="bookmark-border" size={64} color="#BBBBBB" />
      <Text style={styles.emptyStateTitle}>No Forked Content</Text>
      <Text style={styles.emptyStateMessage}>
        When you fork content, it will appear here for quick access and collaboration.
      </Text>
      <TouchableOpacity style={styles.emptyStateCTA}>
        <MaterialIcons name="explore" size={18} color="#FFFFFF" />
        <Text style={styles.emptyStateCTAText}>Explore Content</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={120}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>My Fork-Board</Text>
          <Text style={styles.headerSubtitle}>
            Content you've saved and collaborated on
          </Text>
        </View>
        
        {renderFilterTabs()}
        
        {enhancedContent.length > 0 ? (
          <>
            {renderCommunityChallenges()}
            
            <FlatList
              data={getFilteredContent()}
              renderItem={renderContentItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.contentList}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          renderEmptyState()
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForkBoardView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2A",
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  filterContainer: {
    backgroundColor: "#2A2A36",
    paddingVertical: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  activeFilterTab: {
    backgroundColor: "#3498DB",
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    color: "#BBBBBB",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  contentList: {
    padding: 16,
    paddingBottom: 80,
  },
  contentCard: {
    backgroundColor: "#2A2A36",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredCard: {
    backgroundColor: "#333340",
    borderWidth: 1,
    borderColor: "rgba(52, 152, 219, 0.3)",
    marginBottom: 24,
  },
  contentImage: {
    width: "100%",
    height: 150,
  },
  featuredImage: {
    height: 180,
  },
  contentMeta: {
    padding: 16,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  featuredTitle: {
    fontSize: 18,
  },
  featuredBadge: {
    backgroundColor: "#FF7F50",
    borderRadius: 4,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorName: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  contentDate: {
    color: "#BBBBBB",
    fontSize: 12,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  typeChip: {
    backgroundColor: "#3498DB",
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 8,
    marginBottom: 8,
  },
  typeChipText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  reactionsBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
  },
  reactionCounter: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  reactionCount: {
    color: "#BBBBBB",
    marginLeft: 4,
    fontSize: 14,
  },
  commentCounter: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentCount: {
    color: "#BBBBBB",
    marginLeft: 4,
    fontSize: 14,
  },
  shareCounter: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  shareCount: {
    color: "#BBBBBB",
    marginLeft: 4,
    fontSize: 14,
  },
  collaboratorsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  collaboratorsCount: {
    color: "#BBBBBB",
    marginLeft: 4,
    fontSize: 14,
  },
  expandButton: {
    marginLeft: "auto",
  },
  // Heritage tracker styles
  heritageTracker: {
    padding: 16,
    paddingTop: 0,
  },
  heritageStage: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  heritagePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3498DB",
    marginRight: 8,
  },
  heritageLine: {
    width: 2,
    height: 12,
    backgroundColor: "rgba(52, 152, 219, 0.5)",
    marginLeft: 5,
  },
  heritageText: {
    color: "#FFFFFF",
    fontSize: 13,
    flex: 1,
  },
  heritageDate: {
    color: "#BBBBBB",
    fontSize: 12,
    marginLeft: 8,
  },
  // Expanded content styles
  expandedContent: {
    backgroundColor: "#232330",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  reactionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reactionButtonText: {
    color: "#FFFFFF",
    marginLeft: 4,
    marginRight: 4,
    fontSize: 13,
  },
  reactionButtonCount: {
    color: "#BBBBBB",
    fontSize: 13,
    fontWeight: "bold",
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsHeader: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    backgroundColor: "#3498DB",
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentAuthor: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  commentTime: {
    color: "#BBBBBB",
    fontSize: 12,
  },
  commentText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentActionText: {
    color: "#BBBBBB",
    fontSize: 12,
    marginLeft: 4,
  },
  addCommentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    marginTop: 8,
  },
  addCommentText: {
    color: "#3498DB",
    marginLeft: 8,
    fontWeight: "500",
  },
  commentInputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    overflow: "hidden",
  },
  commentInput: {
    color: "#FFFFFF",
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  commentInputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelCommentButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  cancelCommentText: {
    color: "#BBBBBB",
  },
  submitCommentButton: {
    backgroundColor: "#3498DB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: "rgba(52, 152, 219, 0.5)",
  },
  submitCommentText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  // Collaborators view styles
  collaboratorsView: {
    backgroundColor: "#232330",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  collaboratorsTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  collaboratorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  collaboratorAvatar: {
    backgroundColor: "#9B59B6",
    marginRight: 12,
  },
  collaboratorInfo: {
    flex: 1,
  },
  collaboratorName: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  collaboratorRole: {
    color: "#BBBBBB",
    fontSize: 12,
  },
  followButton: {
    backgroundColor: "rgba(155, 89, 182, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followButtonText: {
    color: "#9B59B6",
    fontSize: 12,
    fontWeight: "500",
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9B59B6",
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 12,
  },
  inviteButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "500",
  },
  // Challenges section styles
  challengesContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: "#3498DB",
    fontSize: 14,
    marginRight: 4,
  },
  challengesList: {
    paddingBottom: 8,
  },
  challengeCard: {
    width: width * 0.8,
    backgroundColor: "#2A2A36",
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    flexDirection: "row",
  },
  activeChallengeCard: {
    backgroundColor: "#333340",
  },
  challengeColorBar: {
    width: 6,
  },
  challengeContent: {
    padding: 16,
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  challengeStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  challengeStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  challengeStatText: {
    color: "#BBBBBB",
    fontSize: 12,
    marginLeft: 4,
  },
  challengeDetails: {
    marginTop: 12,
  },
  challengeDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  joinChallengeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    borderRadius: 4,
  },
  joinChallengeText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "500",
  },
  // Empty state styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    color: "#BBBBBB",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateCTA: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498DB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateCTAText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
});