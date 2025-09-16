import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationFinish: () => void;
  duration?: number;
}

export default function SplashScreen({ onAnimationFinish, duration = 3000 }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create a continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start the main animation sequence
    const animationSequence = Animated.sequence([
      // Fade in and scale up the logo with rotation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // Fade in text
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Hold the logo visible
      Animated.delay(duration - 2500),
      // Fade out everything
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Start both animations
    pulseAnimation.start();
    animationSequence.start(() => {
      pulseAnimation.stop();
      onAnimationFinish();
    });

    return () => {
      animationSequence.stop();
      pulseAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, rotateAnim, textFadeAnim, pulseAnim, duration, onAnimationFinish]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#160000', '#420000', '#160000', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                // transform: [
                //   { scale: scaleAnim },
                //   { 
                //     rotate: rotateAnim.interpolate({
                //       inputRange: [0, 1],
                //       outputRange: ['0deg', '360deg'],
                //     })
                //   }
                // ],
              },
            ]}
          >
            {/* Logo Image with Pulse Animation */}
            <Animated.View 
              style={[
                styles.logoWrapper,
                {
                  transform: [{ scale: pulseAnim }],
                }
              ]}
            >
              <Image
                source={require('../../assets/images/Aeternatv-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
            
            {/* App Name */}
            <Animated.Text 
              style={[
                styles.appName,
                { opacity: textFadeAnim }
              ]}
            >
              AETERNA TV
            </Animated.Text>
            
            {/* Tagline */}
            <Animated.Text 
              style={[
                styles.tagline,
                { opacity: textFadeAnim }
              ]}
            >
              Stream. Discover. Enjoy.
            </Animated.Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradientBackground: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 140,
    height: 140,
    marginBottom: 32,
    borderRadius: 70,
    backgroundColor: 'rgba(66, 0, 0, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(66, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#420000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 15,
  },
  logo: {
    width: 90,
    height: 90,
    tintColor: '#FFFFFF',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: 'rgba(66, 0, 0, 0.5)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
    letterSpacing: 1.5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
