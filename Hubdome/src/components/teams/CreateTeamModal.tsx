// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { Button, Chip } from "react-native-paper";
// import { useSelector, useDispatch } from "react-redux";

// interface CreateTeamModalProps {
//   isVisible: boolean;
//   onClose: () => void;
//   navigation: any; // Ideally use a more specific type from react-navigation
// }

// const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isVisible, onClose, navigation }) => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user.userInfo);
  
//   // Form state
//   const [teamName, setTeamName] = useState("");
//   const [teamDescription, setTeamDescription] = useState("");
//   const [selectedHobby, setSelectedHobby] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [inviteOpen, setInviteOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Mock hobby options
//   const hobbyOptions = [
//     { id: "1", name: "Photography", color: "#F97316" },
//     { id: "2", name: "Hiking", color: "#3B82F6" },
//     { id: "3", name: "Cooking", color: "#EF4444" },
//     { id: "4", name: "Gaming", color: "#8B5CF6" },
//     { id: "5", name: "Music", color: "#EC4899" },
//     { id: "6", name: "Reading", color: "#10B981" },
//     { id: "7", name: "Art", color: "#F59E0B" },
//     { id: "8", name: "Sports", color: "#06B6D4" },
//   ];
  
//   // Mock user suggestions
//   const userSuggestions = [
//     { id: "1", name: "John Doe", username: "@johndoe", avatar: null },
//     { id: "2", name: "Jane Smith", username: "@janesmith", avatar: null },
//     { id: "3", name: "Alex Johnson", username: "@alexj", avatar: null },
//     { id: "4", name: "Sarah Williams", username: "@sarahw", avatar: null },
//     { id: "5", name: "Michael Brown", username: "@michaelb", avatar: null },
//   ];
  
//   // Reset form on modal close
//   const resetForm = () => {
//     setTeamName("");
//     setTeamDescription("");
//     setSelectedHobby(null);
//     setSearchTerm("");
//     setSelectedMembers([]);
//     setInviteOpen(false);
//   };
  
//   // Toggle member selection
//   const toggleMemberSelection = (userId: string) => {
//     if (selectedMembers.includes(userId)) {
//       setSelectedMembers(selectedMembers.filter(id => id !== userId));
//     } else {
//       setSelectedMembers([...selectedMembers, userId]);
//     }
//   };
  
//   // Filter hobbies based on search term
//   const filteredHobbies = hobbyOptions.filter(hobby =>
//     hobby.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   // Filter users based on search term
//   const filteredUsers = userSuggestions.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   // Handle form submission
//   const handleSubmit = () => {
//     // Validate form
//     if (!teamName.trim()) {
//       Alert.alert("Error", "Please enter a team name");
//       return;
//     }
    
//     if (!teamDescription.trim()) {
//       Alert.alert("Error", "Please enter a team description");
//       return;
//     }
    
//     if (!selectedHobby) {
//       Alert.alert("Error", "Please select a hobby for your team");
//       return;
//     }
    
//     // Show loading state
//     setLoading(true);
    
//     // Prepare team data
//     const teamData = {
//       name: teamName,
//       description: teamDescription,
//       hobbyId: selectedHobby,
//       members: selectedMembers,
//     };
    
//     console.log("Creating team with data:", teamData);
    
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       resetForm();
//       onClose();
      
//       // Show success message
//       Alert.alert(
//         "Team Created",
//         "Your team has been created successfully!",
//         [{ text: "OK" }]
//       );
//     }, 1500);
    
//     // In a real app, you would dispatch an action to create the team
//     // dispatch(createTeam(teamData));
//   };
  
//   return (
//     <Modal
//       visible={isVisible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.modalContainer}
//       >
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Create a New Team</Text>
//             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//               <MaterialIcons name="close" size={24} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Team Name*</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Give your team a name"
//                 placeholderTextColor="#888888"
//                 value={teamName}
//                 onChangeText={setTeamName}
//               />
//             </View>
            
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Description*</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="Describe your team and its purpose"
//                 placeholderTextColor="#888888"
//                 value={teamDescription}
//                 onChangeText={setTeamDescription}
//                 multiline
//                 numberOfLines={4}
//               />
//             </View>
            
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Select Hobby*</Text>
//               {selectedHobby ? (
//                 <View style={styles.selectedHobbyContainer}>
//                   <View style={styles.selectedHobby}>
//                     <View
//                       style={[
//                         styles.hobbyColorIndicator,
//                         { backgroundColor: hobbyOptions.find(h => h.id === selectedHobby)?.color || "#3498DB" }
//                       ]}
//                     />
//                     <Text style={styles.selectedHobbyText}>
//                       {hobbyOptions.find(h => h.id === selectedHobby)?.name}
//                     </Text>
//                   </View>
//                   <TouchableOpacity
//                     onPress={() => setSelectedHobby(null)}
//                     style={styles.removeHobbyButton}
//                   >
//                     <MaterialIcons name="close" size={20} color="#FFFFFF" />
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <>
//                   <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search hobbies..."
//                     placeholderTextColor="#888888"
//                     value={searchTerm}
//                     onChangeText={setSearchTerm}
//                   />
//                   <ScrollView
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     style={styles.hobbyList}
//                   >
//                     {filteredHobbies.map(hobby => (
//                       <TouchableOpacity
//                         key={hobby.id}
//                         style={[styles.hobbyOption, { borderColor: hobby.color }]}
//                         onPress={() => {
//                           setSelectedHobby(hobby.id);
//                           setSearchTerm("");
//                         }}
//                       >
//                         <View
//                           style={[styles.hobbyColorDot, { backgroundColor: hobby.color }]}
//                         />
//                         <Text style={styles.hobbyName}>{hobby.name}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </ScrollView>
//                 </>
//               )}
//             </View>
            
//             <View style={styles.inputGroup}>
//               <View style={styles.inviteMembersHeader}>
//                 <Text style={styles.inputLabel}>Invite Members</Text>
//                 <TouchableOpacity
//                   style={styles.toggleInviteButton}
//                   onPress={() => setInviteOpen(!inviteOpen)}
//                 >
//                   <Text style={styles.toggleInviteText}>
//                     {inviteOpen ? "Hide" : "Show"}
//                   </Text>
//                   <MaterialIcons
//                     name={inviteOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
//                     size={20}
//                     color="#3498DB"
//                   />
//                 </TouchableOpacity>
//               </View>