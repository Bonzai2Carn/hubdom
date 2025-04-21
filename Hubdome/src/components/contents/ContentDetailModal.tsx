// src/components/discover/ContentDetailModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  Share,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar, Chip, Badge, Button, Divider } from 'react-native-paper';
import { ContentDetailModalProps, ContentItem } from '../../types/discover';
import { theme } from '../../utils/theme';

const { width, height } = Dimensions.get('window');

// Enhanced ContentDetailModal with community features
const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  visible,
  item,
  onClose,
  onFork,
}) => {
  // State
  const [activeTab, setActiveTab] = useState<'about' | 'discussion' | 'related'>('about');
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showCollaborationOptions, setShowCollaborationOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  // Reset state on modal open/close
  useEffect(() => {
    if (visible) {
      setActiveTab('about');
      setComment('');
      setShowCollaborationOptions(false);
      setShowShareOptions(false);
      
      // Run entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(0);
      scaleAnim.setValue(0);
    }
  }, [visible, fadeAnim, slideAnim, scaleAnim]);
  
  // Mock comments for the item
  const comments = [
    {
      id: '1',
      author: 'Alex Johnson',
      avatar: null,
      text: "This is exactly what I've been looking for! The techniques mentioned here are incredibly useful.",
      timestamp: '2h ago',
      likes: 12,
      replies: 2,
    },
    {
      id: '2',
      author: 'Sarah Chen',
      avatar: null,
      text: 'I tried this approach last week and it worked great. One thing to add is that you should make sure to check the settings before starting.',
      timestamp: '5h ago',
      likes: 8,
      replies: 1,
    },
    {
      id: '3',
      author: 'Michael Rodriguez',
      avatar: null,
      text: "Has anyone integrated this with other tools? I'm trying to build a comprehensive workflow.",
      timestamp: '1d ago',
      likes: 4,
      replies: 3,
    },
  ];
  
  // Mock related content
  const relatedContent = [
    {
      id: 'related-1',
      title: 'Advanced Techniques for Beginners',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x180',
      author: 'TechMaster',
      views: 1243,
    },
    {
      id: 'related-2',
      title: 'Community Discussion: Best Practices',
      type: 'thread',
      thumbnail: null,
      author: 'HobbyHub Team',
      replies: 38,
    },
    {
      id: 'related-3',
      title: 'Quick Tutorial: Getting Started',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x180',
      author: 'HobbyHub Creator',
      views: 782,
    },
  ];
  
  // If no item, don't render anything
  if (!item) return null;
  
  // Handle submitting a comment
  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    
    // Show loading state
    setIsSubmittingComment(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Reset state
      setComment('');
      setIsSubmittingComment(false);
      
      // In a real app, we would add the comment to the list
      alert('Your comment has been posted!');
    }, 1000);
  };
  
  // Handle sharing the content
  const handleShare = async () => {
    try {
      // Close share options panel
      setShowShareOptions(false);
      
      // Use platform sharing functionality
      const result = await Share.share({
        message: `Check out "${item.title}" on HobbyHub!`,
        url: 'https://hobbyhub.app/content/' + item.id,
        title: item.title,
      });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };
  
  // Handle forking the content
  const handleFork = () => {
    // Close collaboration options panel
    setShowCollaborationOptions(false);
    
    // Call the fork handler from props
    if (onFork) {
      onFork(item);
    }
  };
  
  // Toggle collaboration options panel
  const toggleCollaborationOptions = () => {
    setShowCollaborationOptions(!showCollaborationOptions);
    setShowShareOptions(false);
    
    Animated.timing(scaleAnim, {
      toValue: showCollaborationOptions ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  // Toggle share options panel
  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
    setShowCollaborationOptions(false);
    
    Animated.timing(scaleAnim, {
      toValue: showShareOptions ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  // Render a related content item
  const renderRelatedItem = ({ item: relatedItem }: { item: any }) => (
    <TouchableOpacity style={styles.relatedItem}>
      {relatedItem.thumbnail ? (
        <Image 
          source={{ uri: relatedItem.thumbnail }} 
          style={styles.relatedItemThumbnail} 
        />
      ) : (
        <View style={[styles.relatedItemThumbnail, styles.relatedItemPlaceholder]}>
          <MaterialIcons 
            name={relatedItem.type === 'video' ? 'videocam' : 'forum'} 
            size={24} 
            color="#BBBBBB" 
          />
        </View>
      )}
      
      <View style={styles.relatedItemContent}>
        <Text style={styles.relatedItemTitle} numberOfLines={2}>
          {relatedItem.title}
        </Text>
        
        <View style={styles.relatedItemMeta}>
          <Text style={styles.relatedItemAuthor}>{relatedItem.author}</Text>
          
          <View style={styles.relatedItemStats}>
            {relatedItem.views ? (
              <Text style={styles.relatedItemStatsText}>
                {relatedItem.views.toLocaleString()} views
              </Text>
            ) : (
              <Text style={styles.relatedItemStatsText}>
                {relatedItem.replies} replies
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Get the icon for the content type
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'video': return 'videocam';
      case 'audio': return 'headset';
      case 'thread': return 'forum';
      default: return 'article';
    }
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <Animated.View 
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerActionButton}
                onPress={toggleShareOptions}
              >
                <MaterialIcons name="share" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.headerActionButton}
                onPress={toggleCollaborationOptions}
              >
                <MaterialIcons name="call-split" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Content - Update the cards and pass them through here for optimization */}
            {/* Content Header */}
            <View style={styles.contentHeader}>
              {item.thumbnail && (
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.contentThumbnail}
                  resizeMode="cover"
                />
              )}
              
              <View style={styles.contentMeta}>
                <Text style={styles.contentTitle}>{item.title}</Text>
                
                <View style={styles.authorRow}>
                  <Avatar.Text
                    size={40}
                    label={item.author?.charAt(0) || "?"}
                    color="#FFFFFF"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>{item.author}</Text>
                    <Text style={styles.contentDate}>{item.date}</Text>
                  </View>
                  
                  <Button 
                    mode="outlined"
                    style={styles.followButton}
                    labelStyle={styles.followButtonText}
                  >
                    Follow
                  </Button>
                </View>
                
                <View style={styles.contentStats}>
                  <View style={styles.contentStat}>
                    <MaterialIcons name="visibility" size={18} color="#BBBBBB" />
                    <Text style={styles.contentStatText}>
                      {Math.floor(Math.random() * 10000).toLocaleString()} views
                    </Text>
                  </View>
                  
                  <View style={styles.contentStat}>
                    <MaterialIcons name="thumb-up-off-alt" size={18} color="#BBBBBB" />
                    <Text style={styles.contentStatText}>
                      {Math.floor(Math.random() * 1000).toLocaleString()} likes
                    </Text>
                  </View>
                  
                  <View style={styles.contentStat}>
                    <MaterialIcons name="call-split" size={18} color="#BBBBBB" />
                    <Text style={styles.contentStatText}>
                      {item.forks || 0} forks
                    </Text>
                  </View>
                </View>
                
                <View style={styles.tagsRow}>
                  <Chip
                    style={styles.typeChip}
                    textStyle={styles.typeChipText}
                    icon={() => (
                      <MaterialIcons
                        name={("tag-faces")}
                        size={16}
                        color="#FFFFFF"
                      />
                    )}
                  >
                    {item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'Content'}
                  </Chip>
                  
                  {item.category && (
                    <Chip
                      style={styles.categoryChip}
                      textStyle={styles.chipText}
                    >
                      {item.category}
                    </Chip>
                  )}
                  
                  {item.importance === 'high' && (
                    <Badge style={styles.importanceBadge}>Featured</Badge>
                  )}
                </View>
              </View>
              
              {/* Content tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === 'about' && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab('about')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'about' && styles.activeTabText,
                    ]}
                  >
                    About
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === 'discussion' && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab('discussion')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'discussion' && styles.activeTabText,
                    ]}
                  >
                    Discussion
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === 'related' && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab('related')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'related' && styles.activeTabText,
                    ]}
                  >
                    Related
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Divider style={styles.divider} />

            <ScrollView style={styles.contentScroll}>
            {/* Tab content */}
            <View style={styles.tabContent}>
              {/* About tab */}
              {activeTab === 'about' && (
                <View style={styles.aboutContent}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.contentDescription}>
                    {item.description || "No description provided."}
                  </Text>
                  
                  {/* Community feedback section */}
                  <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                    Community Feedback
                  </Text>
                  
                  <View style={styles.feedbackStats}>
                    <View style={styles.feedbackStat}>
                      <Text style={styles.feedbackStatValue}>96%</Text>
                      <Text style={styles.feedbackStatLabel}>Found Helpful</Text>
                    </View>
                    
                    <View style={styles.feedbackStat}>
                      <Text style={styles.feedbackStatValue}>87%</Text>
                      <Text style={styles.feedbackStatLabel}>Would Recommend</Text>
                    </View>
                    
                    <View style={styles.feedbackStat}>
                      <Text style={styles.feedbackStatValue}>4.8</Text>
                      <Text style={styles.feedbackStatLabel}>Average Rating</Text>
                    </View>
                  </View>
                  
                  {/* Top reactions */}
                  <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                    Top Reactions
                  </Text>
                  
                  <View style={styles.reactionsRow}>
                    <TouchableOpacity style={styles.reactionBubble}>
                      <Text style={styles.reactionEmoji}>👍</Text>
                      <Text style={styles.reactionCount}>148</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.reactionBubble}>
                      <Text style={styles.reactionEmoji}>❤️</Text>
                      <Text style={styles.reactionCount}>86</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.reactionBubble}>
                      <Text style={styles.reactionEmoji}>🔥</Text>
                      <Text style={styles.reactionCount}>64</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.reactionBubble}>
                      <Text style={styles.reactionEmoji}>💡</Text>
                      <Text style={styles.reactionCount}>42</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.reactionBubble}>
                      <Text style={styles.reactionEmoji}>🙏</Text>
                      <Text style={styles.reactionCount}>39</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Lineage/heritage tracking */}
                  <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                    Content History
                  </Text>
                  
                  <View style={styles.heritageContainer}>
                    <View style={styles.heritageItem}>
                      <View style={styles.heritageIcon}>
                        <MaterialIcons name="create-new-folder" size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.heritageContent}>
                        <Text style={styles.heritageTitle}>Original content created</Text>
                        <Text style={styles.heritageDate}>Apr 12, 2025</Text>
                      </View>
                    </View>
                    
                    <View style={styles.heritageLine} />
                    
                    <View style={styles.heritageItem}>
                      <View style={styles.heritageIcon}>
                        <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.heritageContent}>
                        <Text style={styles.heritageTitle}>Updated with community feedback</Text>
                        <Text style={styles.heritageDate}>Apr 15, 2025</Text>
                      </View>
                    </View>
                    
                    <View style={styles.heritageLine} />
                    
                    <View style={styles.heritageItem}>
                      <View style={styles.heritageIcon}>
                        <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.heritageContent}>
                        <Text style={styles.heritageTitle}>Featured in weekly digest</Text>
                        <Text style={styles.heritageDate}>Apr 18, 2025</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              
              {/* Discussion tab */}
              {activeTab === 'discussion' && (
                <View style={styles.discussionContent}>
                  <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
                  
                  {comments.map((comment) => (
                    <View key={comment.id} style={styles.commentItem}>
                      <Avatar.Text
                        size={40}
                        label={comment.author?.charAt(0) || "?"}
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
                            <Text style={styles.commentActionText}>
                              Reply ({comment.replies})
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                  
                  {/* Add comment section */}
                  <View style={styles.addCommentSection}>
                    <Avatar.Text
                      size={40}
                      label="Y"
                      color="#FFFFFF"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    
                    <View style={styles.commentInputContainer}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        placeholderTextColor="#BBBBBB"
                        value={comment}
                        onChangeText={setComment}
                        multiline
                      />
                      
                      {comment.trim() !== '' && (
                        <TouchableOpacity
                          style={styles.submitCommentButton}
                          onPress={handleSubmitComment}
                          disabled={isSubmittingComment}
                        >
                          {isSubmittingComment ? (
                            <MaterialIcons name="hourglass-empty" size={20} color="#FFFFFF" />
                          ) : (
                            <MaterialIcons name="send" size={20} color="#FFFFFF" />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
              
              {/* Related content tab */}
              {activeTab === 'related' && (
                <View style={styles.relatedContent}>
                  <Text style={styles.sectionTitle}>Related Content</Text>
                  
                  <FlatList
                    data={relatedContent}
                    renderItem={renderRelatedItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.relatedList}
                    scrollEnabled={false}
                  />
                  
                  <Button
                    mode="outlined"
                    style={styles.viewMoreButton}
                    labelStyle={styles.viewMoreButtonText}
                  >
                    View More
                  </Button>
                </View>
              )}
            </View>
          </ScrollView>
          
          {/* Collaboration options panel */}
          {showCollaborationOptions && (
            <Animated.View 
              style={[
                styles.optionsPanel,
                {
                  opacity: scaleAnim,
                  transform: [
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <View style={styles.optionsPanelHeader}>
                <Text style={styles.optionsPanelTitle}>Collaboration Options</Text>
                <TouchableOpacity onPress={toggleCollaborationOptions}>
                  <MaterialIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.optionItem}
                onPress={handleFork}
              >
                <MaterialIcons name="call-split" size={24} color="#3498DB" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Fork this content</Text>
                  <Text style={styles.optionDescription}>
                    Create your own version to modify and share
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem}>
                <MaterialIcons name="edit" size={24} color="#F1C40F" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Suggest edits</Text>
                  <Text style={styles.optionDescription}>
                    Propose changes to the original creator
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem}>
                <MaterialIcons name="group-add" size={24} color="#9B59B6" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Join as collaborator</Text>
                  <Text style={styles.optionDescription}>
                    Request to join the creation team
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {/* Share options panel */}
          {showShareOptions && (
            <Animated.View 
              style={[
                styles.optionsPanel,
                {
                  opacity: scaleAnim,
                  transform: [
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <View style={styles.optionsPanelHeader}>
                <Text style={styles.optionsPanelTitle}>Share Options</Text>
                <TouchableOpacity onPress={toggleShareOptions}>
                  <MaterialIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.optionItem}
                onPress={handleShare}
              >
                <MaterialIcons name="share" size={24} color="#3498DB" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Share externally</Text>
                  <Text style={styles.optionDescription}>
                    Share via messaging apps or social media
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem}>
                <MaterialIcons name="group" size={24} color="#2ECC71" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Share with community</Text>
                  <Text style={styles.optionDescription}>
                    Share with hobby groups you're part of
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionItem}>
                <MaterialIcons name="link" size={24} color="#F1C40F" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Copy link</Text>
                  <Text style={styles.optionDescription}>
                    Copy a direct link to this content
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: height * 0.9,
    width: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    padding: 8,
    marginLeft: 8,
  },
  contentScroll: {
    flex: 1,
  },
  contentHeader: {
    padding: 16,
  },
  contentThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  contentMeta: {
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  contentDate: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  followButton: {
    borderColor: theme.colors.primary,
    borderRadius: 20,
  },
  followButtonText: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  contentStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  contentStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  contentStatText: {
    color: '#BBBBBB',
    fontSize: 14,
    marginLeft: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeChip: {
    backgroundColor: theme.colors.primary,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  typeChipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  importanceBadge: {
    backgroundColor: theme.colors.accent,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    color: '#BBBBBB',
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabContent: {
    padding: 16,
    paddingBottom: 100, // Extra space at bottom
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  contentDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aboutContent: {
    
  },
  feedbackStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 8,
  },
  feedbackStat: {
    alignItems: 'center',
  },
  feedbackStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  feedbackStatLabel: {
    fontSize: 12,
    color: '#BBBBBB',
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reactionBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    minWidth: 60,
  },
  reactionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  reactionCount: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  heritageContainer: {
    marginTop: 8,
  },
  heritageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  heritageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heritageContent: {
    flex: 1,
  },
  heritageTitle: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  heritageDate: {
    color: '#BBBBBB',
    fontSize: 12,
  },
  heritageLine: {
    width: 2,
    height: 24,
    backgroundColor: 'rgba(52, 152, 219, 0.5)',
    marginLeft: 18,
    marginBottom: 8,
  },
  discussionContent: {
    
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentAvatar: {
    backgroundColor: theme.colors.primary,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  commentTime: {
    color: '#BBBBBB',
    fontSize: 12,
  },
  commentText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    color: '#BBBBBB',
    fontSize: 12,
    marginLeft: 4,
  },
  commentInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 16,
  },
  relatedContent: {
    marginTop: 16,
  },
  relatedItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  relatedItemThumbnail: {
    width: 120,
    height: 80,
  },
  relatedItemPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedItemContent: {
    flex: 1,
    padding: 12,
  },
  relatedItemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  relatedItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedItemAuthor: {
    color: '#BBBBBB',
    fontSize: 12,
  },
  relatedItemStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedItemStatsText: {
    color: '#BBBBBB',
    fontSize: 12,
    marginLeft: 4,
  },
  optionsPanel: {
    position: 'absolute',
    right: 16,
    top: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 8,
    // ...theme.shadows.medium,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 12,
  },
  collaborationPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    // ...theme.shadows.large,
  },
  collaborationTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  collaborationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  collaborationOptionText: {
    flex: 1,
    marginLeft: 12,
  },
  collaborationOptionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  collaborationOptionDescription: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  sharePanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    // ...theme.shadows.large,
  },
  shareTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  shareOption: {
    alignItems: 'center',
  },
  shareOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareOptionText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  cancelButton: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  addCommentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  commentInputContainer: {
    flex: 1,
    marginLeft: 12,
  },
  submitCommentButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedList: {
    paddingBottom: 16, 
  },
  viewMoreButton: {
    marginTop: 16,
    alignSelf: 'center',
    borderRadius: 20,
  },
  viewMoreButtonText: { 
    color: theme.colors.primary,
    fontSize: 14,
  },
  optionsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  optionsPanelTitle: {
    color: '#FFFFFF',
    fontSize: 18, 
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionDescription: {
    color: '#BBBBBB',
    fontSize: 14,
  }







});

export default ContentDetailModal;