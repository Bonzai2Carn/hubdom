import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const hobbyCategories = [
    {
        id: 'artistic',
        name: 'Artistic',
        icon: 'palette',
        color: '#9B59B6',
        subcategories: [
            'Painting',
            'Drawing',
            'Sculpting',
            'Photography',
            'Writing',
            'Calligraphy',
            'Origami',
            'Pottery',
            'Jewelry Making',
            'Scrapbooking',
            'Knitting',
            'Crocheting',
            'Embroidery',
            'Quilting',
            'Weaving',
            'Woodcarving',
            'Glassblowing',
            'Mosaic Art',
            'Collage',
            'Digital Art',
        ],
    },
    {
        id: 'outdoor',
        name: 'Outdoor',
        icon: 'terrain',
        color: '#27AE60',
        subcategories: [
            'Hiking',
            'Camping',
            'Fishing',
            'Hunting',
            'Birdwatching',
            'Gardening',
            'Geocaching',
            'Rock Climbing',
            'Mountain Biking',
            'Kayaking',
            'Canoeing',
            'Surfing',
            'Sailing',
            'Windsurfing',
            'Kiteboarding',
            'Skateboarding',
            'Snowboarding',
            'Skiing',
            'Ice Skating',
            'Rollerblading',
        ],
    },
    {
        id: 'physical',
        name: 'Physical',
        icon: 'fitness-center',
        color: '#E67E22',
        subcategories: [
            'Running',
            'Swimming',
            'Cycling',
            'Yoga',
            'Pilates',
            'Martial Arts',
            'Boxing',
            'Weightlifting',
            'Dance',
            'Gymnastics',
            'Soccer',
            'Basketball',
            'Tennis',
            'Golf',
            'Bowling',
            'Archery',
            'Fencing',
            'Equestrian Sports',
            'Parkour',
            'CrossFit',
        ],
    },
    {
        id: 'musical',
        name: 'Musical',
        icon: 'music-note',
        color: '#F1C40F',
        subcategories: [
            'Playing an Instrument',
            'Singing',
            'Songwriting',
            'Music Production',
            'DJing',
            'Music Theory',
            'Music Appreciation',
            'Attending Concerts',
            'Joining a Band or Choir',
        ],
    },
    {
        id: 'tech',
        name: 'Tech and Gadgets',
        icon: 'memory',
        color: '#2980B9',
        subcategories: [
            'Building Computers',
            'Programming',
            'Robotics',
            'Drone Flying',
            '3D Printing',
            'Virtual Reality',
            'Augmented Reality',
            'Smart Home Automation',
            'Electronics Repair',
            'Video Game Development',
        ],
    },
    {
        id: 'culinary',
        name: 'Culinary',
        icon: 'restaurant',
        color: '#C0392B',
        subcategories: [
            'Cooking',
            'Baking',
            'Barbecuing',
            'Brewing Beer',
            'Wine Making',
            'Mixology',
            'Food Photography',
            'Food Blogging',
            'Food Styling',
            'Food Preservation',
        ],
    },
    {
        id: 'diy',
        name: 'DIY and Craft',
        icon: 'build',
        color: '#8E44AD',
        subcategories: [
            'Home Improvement',
            'Furniture Building',
            'Upcycling',
            'Woodworking',
            'Metalworking',
            'Leatherworking',
            'Soap Making',
            'Candle Making',
            'Paper Crafting',
            'Scrapbooking',
            'Model Building',
        ],
    },
    {
        id: 'connection',
        name: 'Connection-Based',
        icon: 'group',
        color: '#16A085',
        subcategories: [
            'Volunteering',
            'Community Service',
            'Mentoring',
            'Networking',
            'Socializing',
            'Hosting Events',
            'Joining Clubs or Groups',
            'Participating in Meetups',
            'Language Exchange',
            'Pen Palling',
        ],
    },
    {
        id: 'spiritual',
        name: 'Spiritual and Mindfulness',
        icon: 'spa',
        color: '#D35400',
        subcategories: [
            'Meditation',
            'Yoga',
            'Tai Chi',
            'Qigong',
            'Prayer',
            'Religious Study',
            'Astrology',
            'Tarot Reading',
            'Crystal Healing',
            'Reiki',
            'Aromatherapy',
            'Journaling',
        ],
    },
    {
        id: 'scientific',
        name: 'Scientific and Intellectual',
        icon: 'school',
        color: '#27AEDB',
        subcategories: [
            'Astronomy',
            'Amateur Radio',
            'Chess',
            'Puzzles',
            'Sudoku',
            'Crosswords',
            'Reading',
            'Writing',
            'Researching',
            'Learning a New Language',
            'Studying History, Philosophy, or Science',
        ],
    },
    {
        id: 'games',
        name: 'Games and Puzzles',
        icon: 'casino',
        color: '#E74C3C',
        subcategories: [
            'Board Games',
            'Card Games',
            'Video Games',
            'Role-Playing Games',
            'Tabletop Games',
            'Puzzles',
            'Crosswords',
            'Sudoku',
            'Chess',
            'Go',
            'Mahjong',
            'Dominoes',
            'Billiards',
            'Darts',
        ],
    },
    {
        id: 'collecting',
        name: 'Collecting',
        icon: 'collections',
        color: '#34495E',
        subcategories: [
            'Stamps',
            'Coins',
            'Antiques',
            'Art',
            'Books',
            'Memorabilia',
            'Vinyl Records',
            'Comic Books',
            'Trading Cards',
            'Dolls',
            'Model Trains',
            'Cars',
            'Action Figures',
            'Sports Memorabilia',
        ],
    },
    {
        id: 'travel',
        name: 'Travel',
        icon: 'flight',
        color: '#2ECC71',
        subcategories: [
            'Backpacking',
            'Road Trips',
            'Cruise Travel',
            'Cultural Immersion',
            'Adventure Travel',
            'Eco-Tourism',
            'Historical Tours',
            'Food Tours',
            'Photography Travel',
            'Volunteering Abroad',
        ],
    },
    {
        id: 'mind',
        name: 'Mind',
        icon: 'psychology',
        color: '#7F8C8D',
        subcategories: [
            'Learning a New Language',
            'Reading',
            'Writing',
            'Studying History, Philosophy, or Science',
            'Puzzles',
            'Brain Teasers',
            'Memory Training',
            'Mental Math',
            'Logic Games',
        ],
    },
    {
        id: 'health',
        name: 'Health',
        icon: 'favorite',
        color: '#E91E63',
        subcategories: [
            'Fitness',
            'Nutrition',
            'Meditation',
            'Yoga',
            'Tai Chi',
            'Qigong',
            'Massage',
            'Acupuncture',
            'Herbalism',
            'Aromatherapy',
            'Sleep Optimization',
        ],
    },
    {
        id: 'money',
        name: 'Money-Making',
        icon: 'attach-money',
        color: '#4CAF50',
        subcategories: [
            'Freelancing',
            'Blogging',
            'Vlogging',
            'E-commerce',
            'Investing',
            'Trading',
            'Real Estate',
            'Affiliate Marketing',
            'Dropshipping',
            'Creating and Selling Crafts or Art',
        ],
    },
];

interface HobbyCategorySelectorProps {
    selectedHobbies: Record<string, string[]>;
    onHobbySelect: (category: string, subcategory: string) => void;
}

const HobbyCategorySelector: React.FC<HobbyCategorySelectorProps> = ({
    selectedHobbies,
    onHobbySelect,
}) => {
    const [activeCategory, setActiveCategory] = useState(hobbyCategories[0].id);

    const activeCategoryData =
        hobbyCategories.find((cat) => cat.id === activeCategory) ||
        hobbyCategories[0];

    const isSubcategorySelected = (category: string, subcategory: string) => {
        return selectedHobbies[category]?.includes(subcategory) || false;
    };

    return (
        <View style={styles.container}>
            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryTabsContainer}
            >
                {hobbyCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryTab,
                            activeCategory === category.id && { backgroundColor: category.color },
                        ]}
                        onPress={() => setActiveCategory(category.id)}
                    >
                        <MaterialIcons
                            name={category.icon as any}
                            size={24}
                            color={activeCategory === category.id ? '#FFFFFF' : category.color}
                        />
                        <Text
                            style={[
                                styles.categoryTabText,
                                activeCategory === category.id && { color: '#FFFFFF' },
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Subcategories */}
            <View style={styles.subcategoriesContainer}>
                <FlatList
                    data={activeCategoryData.subcategories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.subcategoryItem,
                                isSubcategorySelected(activeCategory, item) && styles.subcategoryItemSelected,
                            ]}
                            onPress={() => onHobbySelect(activeCategory, item)}
                        >
                            <Text
                                style={[
                                    styles.subcategoryText,
                                    isSubcategorySelected(activeCategory, item) && styles.subcategoryTextSelected,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    categoryTabsContainer: {
        paddingHorizontal: 10,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    categoryTabText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#333',
    },
    subcategoriesContainer: {
        marginTop: 15,
        paddingHorizontal: 10,
    },
    subcategoryItem: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
    },
    subcategoryItemSelected: {
        backgroundColor: '#3498DB',
        borderColor: '#3498DB',
    },
    subcategoryText: {
        fontSize: 14,
        color: '#333',
    },
    subcategoryTextSelected: {
        color: '#fff',
    },
});

export default HobbyCategorySelector;