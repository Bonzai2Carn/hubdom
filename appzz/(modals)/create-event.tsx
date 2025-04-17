import { View } from 'react-native';
import CreateEventModal from '@/src/components/events/CreateEventModal';
import { router } from 'expo-router';

export default function CreateEventScreen() {
  return (
    <View style={{ flex: 1 }}>
      <CreateEventModal
        isVisible={true}
        onClose={() => router.back()}
        onSubmit={(data) => {
          console.log('Event created:', data);
          router.back();
        }}
      />
    </View>
  );
}