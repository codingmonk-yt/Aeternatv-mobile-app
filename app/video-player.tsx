import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useLandscapeOrientation } from '../src/hooks/useOrientationLock';

interface VideoPlayerPageProps {
  videoUrl?: string;
  title?: string;
  onBackPress?: () => void;
}

export default function VideoPlayerPage({ 
  videoUrl, 
  title,
  onBackPress
}: VideoPlayerPageProps) {
  const insets = useSafeAreaInsets();
  const [showControls, setShowControls] = useState(true);
  
  // Lock orientation to landscape for video player
  useLandscapeOrientation();

  const videoSource = videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  // HTML template for the video player
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          background: #000;
          overflow: hidden;
        }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: ${insets.left}px;
          padding-right: ${insets.right}px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-context-menu: none;
        }
        video {
          width: calc(100vw - ${insets.left + insets.right}px);
          height: 100vh;
          object-fit: contain;
          background: #000;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-context-menu: none;
        }
        video::-webkit-media-controls {
          -webkit-user-select: none;
        }
        video::-webkit-media-controls-enclosure {
          -webkit-user-select: none;
        }
      </style>
    </head>
    <body>
      <video 
        id="videoPlayer"
        controls 
        autoplay 
        playsinline
        webkit-playsinline
        disablepictureinpicture
        controlslist="nodownload nofullscreen noremoteplayback"
        oncontextmenu="return false;"
        src="${videoSource}"
        preload="auto"
      >
        Your browser does not support the video tag.
      </video>
    </body>
    </html>
  `;

  // Auto-hide controls after 4 seconds
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  const handleBackPress = () => {
    if (onBackPress) onBackPress();
  };

  const handleVideoPress = () => {
    setShowControls(true);
  };

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <TouchableOpacity 
        style={[styles.videoContainer, {
          paddingLeft: insets.left,
          paddingRight: insets.right
        }]}
        activeOpacity={1}
        onPress={handleVideoPress}
      >
        <WebView
          source={{ html: htmlContent }}
          style={styles.video}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          mixedContentMode="compatibility"
          androidLayerType="hardware"
        />
        {/* Custom Controls Overlay - Only Back Button */}
        {showControls && (
          <View style={[styles.controlsOverlay, { 
            top: 20,
            left: insets.left + 20,
            right: insets.right + 20
          }]}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
            >
              <View style={styles.backButtonInner}>
                <X size={24} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {title || 'Now Playing'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// --- Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000000',
  },
  video: {
    flex: 1,
    backgroundColor: '#000000',
  },
  controlsOverlay: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonInner: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: '80%',
  },
});