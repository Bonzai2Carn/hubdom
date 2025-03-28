// src/components/events/AnalyticsCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>{title}</Text>
        <MaterialIcons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#2A2A36',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AnalyticsCard;