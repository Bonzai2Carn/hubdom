import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import EventDetail from '../../src/components/events/EventDetail';

export default function EventDetailScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  
  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      if (screen.includes('Detail')) {
        router.push({
          pathname: `./home/${screen.toLowerCase().replace('detail', '-detail')}`,
          params: params
        });
      } else {
        router.push(`./home/${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back()
  };
  
  // Create a route object compatible with the existing component
  const routeParams = {
    params: {
      eventId: typeof eventId === 'string' ? eventId : ''
    }
  };
  
  return <EventDetail route={routeParams as any} navigation={navigationProp as any} />; //not properly typed
}