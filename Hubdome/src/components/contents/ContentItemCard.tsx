//src/components/contents/ContentAction.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar, Button, Chip, Badge } from 'react-native-paper';
import { ContentItem } from '../../types/discover';
import { theme } from '../../utils/theme';

interface ContentItemCardProps {
  item: ContentItem;
  onPress: (item: ContentItem) => void;
  toggleShareOptions: () => void;
  toggleCollaborationOptions: () => void;
}

const ContentItemCard: React.FC<ContentItemCardProps> = ({
  item,
  onPress,
  toggleShareOptions,
  toggleCollaborationOptions
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >

      <View style={styles.authorRow}>
        {/* <Avatar.Text
          size={10}
          label={item.author?.charAt(0) || "?"}
          color="#FFFFFF"
          style={{ backgroundColor: theme.colors.primary }}
        /> */}

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
        
        {/* probably wrap in a container and place in flex end */}
        <TouchableOpacity 
          style={styles.contentStat}
          onPress={toggleShareOptions}
        >
          <MaterialIcons name="share" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contentStat}
          onPress={toggleCollaborationOptions}
        >
          <MaterialIcons name="call-split" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {item.importance === 'high' && (
          <Badge style={styles.importanceBadge}>Featured</Badge>
        )}
      </View>
      {/* </View> */}
      {/* </View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    // borderRadius: theme.roundness,
    overflow: 'hidden',
    // borderWidth: 2,
    borderTopWidth: 2,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 12,
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
  // contentHeader: {
  //   padding: 16,
  // },
  // contentMeta: {
  //   marginBottom: 16,
  // },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    alignItems: 'baseline',
    backgroundColor: theme.colors.accent,
  },
});

export default ContentItemCard;
