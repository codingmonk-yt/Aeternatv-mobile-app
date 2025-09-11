import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, {
    useEffect,
    useRef, useState
} from 'react';
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Movie {
    id: string;
    title: string;
    image: string;
    year: string;
    duration: string;
    cast: Array<{
        name: string;
        image: string;
    }>;
}

interface VideoPlayerProps {
    movie: Movie;
    onClose: () => void;
}

export default function VideoPlayerScreen({ movie, onClose }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [progress, setProgress] = useState(0);
    
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const videoRef = useRef<Video>(null);

    // Auto-hide controls after 3 seconds
    useEffect(() => {
        if (showControls) {
            controlsTimeout.current = setTimeout(() => {
                hideControls();
            }, 3000);
        }
        return () => {
            if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
        };
    }, [showControls]);

    const hideControls = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setShowControls(false);
    };

    const showControlsWithTimeout = () => {
        setShowControls(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        showControlsWithTimeout();
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        showControlsWithTimeout();
    };

    const handleBackPress = () => {
        console.log('Back button pressed!');
        onClose();
    };

    const skipToPrevious = () => {
        console.log('Skip to previous');
        showControlsWithTimeout();
    };

    const rewind10Seconds = async () => {
        console.log('Rewind 10 seconds');
        try {
            if (videoRef.current) {
                const status = await videoRef.current.getStatusAsync();
                if (status.isLoaded) {
                    const newPosition = Math.max(0, (status.positionMillis || 0) - 10000);
                    await videoRef.current.setPositionAsync(newPosition);
                }
            }
        } catch (error) {
            console.log('Error rewinding:', error);
        }
        showControlsWithTimeout();
    };

    const fastForward10Seconds = async () => {
        console.log('Fast forward 10 seconds');
        try {
            if (videoRef.current) {
                const status = await videoRef.current.getStatusAsync();
                if (status.isLoaded) {
                    const newPosition = Math.min(
                        status.durationMillis || 0, 
                        (status.positionMillis || 0) + 10000
                    );
                    await videoRef.current.setPositionAsync(newPosition);
                }
            }
        } catch (error) {
            console.log('Error fast forwarding:', error);
        }
        showControlsWithTimeout();
    };

    const skipToNext = () => {
        console.log('Skip to next');
        showControlsWithTimeout();
    };

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const seekToPosition = async (position: number) => {
        try {
            if (videoRef.current && totalTime > 0) {
                const seekTime = (position / 100) * totalTime;
                await videoRef.current.setPositionAsync(seekTime);
                setCurrentTime(seekTime);
                setProgress(position);
            }
        } catch (error) {
            console.log('Error seeking:', error);
        }
    };

    const handleProgressPress = (event: any) => {
        const { locationX, target } = event.nativeEvent;
        const progressBarWidth = target?.offsetWidth || 200;
        const position = (locationX / progressBarWidth) * 100;
        const clampedPosition = Math.max(0, Math.min(100, position));
        console.log('Progress bar clicked:', locationX, progressBarWidth, clampedPosition);
        seekToPosition(clampedPosition);
        showControlsWithTimeout();
    };

    // Pan responder for tap to show/hide controls
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            if (showControls) {
                hideControls();
            } else {
                showControlsWithTimeout();
            }
        },
    });

    // Handle orientation change
    useEffect(() => {
        const handleOrientationChange = ({ window }: any) => {
            const { width, height } = window;
            const isLandscape = width > height;
            console.log('Orientation changed:', isLandscape ? 'landscape' : 'portrait', 'Dimensions:', width, 'x', height);
            setIsFullscreen(isLandscape);
        };

        const subscription = Dimensions.addEventListener('change', handleOrientationChange);
        return () => subscription?.remove();
    }, []);

    return (
        <View style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
            <StatusBar 
                barStyle="light-content" 
                backgroundColor="#000000" 
                hidden={isFullscreen}
            />
            
            {/* Video Area */}
            <View style={[styles.videoContainer, isFullscreen && styles.fullscreenVideoContainer]} {...panResponder.panHandlers}>
                <Video
                    ref={videoRef}
                    source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                    style={[styles.videoBackground, isFullscreen && styles.fullscreenVideo]}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={isPlaying}
                    isLooping
                    isMuted={isMuted}
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded) {
                            setCurrentTime(status.positionMillis || 0);
                            setTotalTime(status.durationMillis || 0);
                            const progressValue = (status.positionMillis || 0) / (status.durationMillis || 1);
                            setProgress(progressValue * 100);
                        }
                    }}
                />
                
                {/* Video Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.videoOverlay}
                />

                {/* Top Controls */}
                {showControls && (
                    <Animated.View style={[styles.topControls, { opacity: fadeAnim }]}>
                        <View style={styles.topControlsContent}>
                            <TouchableOpacity 
                                style={styles.backButton} 
                                onPress={handleBackPress}
                                activeOpacity={0.7}
                            >
                                <Image 
                                    source={require('../assets/icons/chevron-left.png')} 
                                    style={styles.backIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            
                            <Text style={styles.movieTitle}>{movie.title}</Text>
                            
                            <TouchableOpacity 
                                style={styles.topButton} 
                                onPress={toggleMute}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.topButtonText}>{isMuted ? '🔇' : '🔊'}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}

                {/* Center Play Button */}
                {showControls && (
                    <Animated.View style={[styles.centerPlayButton, { opacity: fadeAnim }]}>
                        <TouchableOpacity 
                            onPress={togglePlayPause}
                            style={styles.playButtonContainer}
                            activeOpacity={0.8}
                        >
                            {isPlaying ? (
                                <Text style={styles.centerPauseIcon}>⏸</Text>
                            ) : (
                                <Image 
                                    source={require('../assets/icons/play.png')} 
                                    style={styles.playIcon}
                                    resizeMode="contain"
                                />
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Bottom Controls */}
                {showControls && (
                    <Animated.View style={[styles.bottomControls, { opacity: fadeAnim }]}>
                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                            <TouchableOpacity 
                                style={styles.progressBar} 
                                onPress={handleProgressPress}
                                activeOpacity={1}
                            >
                                <View style={[styles.progressFill, { width: `${progress}%` }]} />
                                <View style={[styles.progressThumb, { left: `${Math.max(0, Math.min(100, progress))}%` }]} />
                            </TouchableOpacity>
                            <Text style={styles.timeText}>{formatTime(totalTime)}</Text>
                        </View>

                        {/* Control Buttons */}
                        <View style={styles.controlButtons}>
                            <TouchableOpacity style={styles.controlButton} onPress={skipToPrevious}>
                                <Text style={styles.controlButtonText}>⏮</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.controlButton} onPress={rewind10Seconds}>
                                <Text style={styles.controlButtonText}>⏪ 10</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.mainPlayButton} 
                                onPress={togglePlayPause}
                                activeOpacity={0.8}
                            >
                                {isPlaying ? (
                                    <Text style={styles.pauseIcon}>⏸</Text>
                                ) : (
                                    <Image 
                                        source={require('../assets/icons/play.png')} 
                                        style={styles.playControlIcon}
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.controlButton} onPress={fastForward10Seconds}>
                                <Text style={styles.controlButtonText}>10 ⏩</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.controlButton} onPress={skipToNext}>
                                <Text style={styles.controlButtonText}>⏭</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </View>

            {/* Movie Content Below Video (only in portrait mode) */}
            {!isFullscreen && (
                <View style={styles.movieContent}>
                    {/* Movie Title */}
                    <Text style={styles.contentTitle}>{movie.title}</Text>
                    
                    {/* Movie Info */}
                    <View style={styles.movieInfo}>
                        <Text style={styles.movieYear}>{movie.year}</Text>
                        <Text style={styles.movieDuration}>{movie.duration}</Text>
                        <Text style={styles.movieRating}>HD</Text>
                    </View>
                    
                    {/* Description */}
                    <Text style={styles.movieDescription}>
                        Experience the thrilling adventure of {movie.title} in this epic story that will keep you on the edge of your seat.
                    </Text>
                    
                    {/* Cast Section */}
                    <View style={styles.castSection}>
                        <Text style={styles.castTitle}>Top Cast</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.castList}
                            decelerationRate="fast"
                            snapToInterval={96}
                            snapToAlignment="start"
                            bounces={false}
                        >
                            {movie.cast.map((actor, index) => (
                                <View key={index} style={styles.castItem}>
                                    <Image 
                                        source={{ uri: actor.image }} 
                                        style={styles.castImage}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.castName}>{actor.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    fullscreenContainer: {
        backgroundColor: '#000000',
    },
    videoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: screenHeight * 0.5, // Half screen height like Netflix
        width: screenWidth,
    },
    fullscreenVideoContainer: {
        height: screenHeight,
        width: screenWidth,
    },
    videoBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    fullscreenVideo: {
        width: screenWidth,
        height: screenHeight,
    },
    videoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    topControls: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    topControlsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: 20,
        height: 20,
        tintColor: '#FFFFFF',
    },
    movieTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginHorizontal: 20,
        fontFamily: 'Inter',
    },
    topButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    centerPlayButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -30 }, { translateY: -30 }],
        zIndex: 10,
    },
    playButtonContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        width: 30,
        height: 30,
        tintColor: '#FFFFFF',
    },
    centerPauseIcon: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
    },
    bottomControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 30,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    timeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter',
        minWidth: 40,
        textAlign: 'center',
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 10,
        borderRadius: 2,
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#A259FF',
        borderRadius: 2,
    },
    progressThumb: {
        position: 'absolute',
        top: -4,
        width: 12,
        height: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        transform: [{ translateX: -6 }],
        zIndex: 1,
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    controlButton: {
        padding: 10,
        marginHorizontal: 5,
    },
    controlButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter',
    },
    mainPlayButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#A259FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    playControlIcon: {
        width: 20,
        height: 20,
        tintColor: '#FFFFFF',
    },
    pauseIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // Movie Content Styles
    movieContent: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        fontFamily: 'Inter',
    },
    movieInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 15,
    },
    movieYear: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Inter',
    },
    movieDuration: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Inter',
    },
    movieRating: {
        fontSize: 14,
        color: '#A259FF',
        backgroundColor: 'rgba(162, 89, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontFamily: 'Inter',
    },
    movieDescription: {
        fontSize: 16,
        color: '#CCCCCC',
        lineHeight: 24,
        marginBottom: 20,
        fontFamily: 'Inter',
    },
    castSection: {
        marginBottom: 20,
    },
    castTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 15,
        fontFamily: 'Inter',
    },
    castList: {
        paddingHorizontal: 0,
    },
    castItem: {
        alignItems: 'center',
        width: 80,
        marginRight: 15,
    },
    castImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    castName: {
        fontSize: 12,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Inter',
    },
});