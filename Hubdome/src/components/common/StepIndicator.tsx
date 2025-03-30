// src/components/common/StepIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  style?: any;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  steps,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <View 
            style={[
              styles.stepCircle, 
              currentStep === index && styles.activeStep,
              currentStep > index && styles.completedStep,
            ]}
          >
            {currentStep > index ? (
              <Text style={styles.stepIcon}>✓</Text>
            ) : (
              <Text style={styles.stepText}>{index + 1}</Text>
            )}
          </View>
          
          {index < steps.length - 1 && (
            <View 
              style={[
                styles.stepLine,
                currentStep > index && styles.activeStepLine
              ]} 
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeStep: {
    backgroundColor: '#3498DB',
  },
  completedStep: {
    backgroundColor: '#2ECC71',
  },
  stepText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  stepIcon: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: -5,
  },
  activeStepLine: {
    backgroundColor: '#2ECC71',
  },
});

export default StepIndicator;