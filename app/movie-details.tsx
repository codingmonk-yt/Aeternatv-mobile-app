import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import VideoPlayerScreen from './video-player';

const { width, height } = Dimensions.get('window');

interface MovieDetailsProps {
    movie: {
        id: string;
        title: string;
        subtitle?: string;
        platform: string;
        releaseDate: string;
        image: string;
        genre: string;
        rating: number;
        year: number;
        duration: string;
        description: string;
        cast: Array<{
            name: string;
            character: string;
            image: string;
        }>;
    };
    onBack: () => void;
    onPlay: () => void;
}

export default function MovieDetailsScreen({ movie, onBack, onPlay }: MovieDetailsProps) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const handlePlay = () => {
        console.log('Play button clicked in movie details!');
        setShowVideoPlayer(true);
    };

    const handleCloseVideoPlayer = () => {
        console.log('Closing video player!');
        setShowVideoPlayer(false);
    };

    // Show Video Player
    if (showVideoPlayer) {
        return (
            <VideoPlayerScreen
                movie={movie}
                onClose={handleCloseVideoPlayer}
            />
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            
            {/* Header */}
            <View style={styles.header}>
                <LinearGradient
                    colors={['#1A1A1A', 'rgba(13, 13, 13, 0.2)']}
                    style={styles.backButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <TouchableOpacity style={styles.buttonContent} onPress={onBack}>
                        <Image 
                            source={require('../assets/icons/chevron-left.png')} 
                            style={styles.backIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                    colors={['#1A1A1A', 'rgba(13, 13, 13, 0.2)']}
                    style={styles.headerButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <TouchableOpacity style={styles.buttonContent}>
                        <Image 
                            source={require('../assets/icons/share.png')} 
                            style={styles.headerIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Movie Poster */}
                <View style={styles.posterContainer}>
                    <Image 
                        source={{ uri: movie.image }} 
                        style={styles.poster}
                        resizeMode="cover"
                    />
                </View>

                {/* Movie Info */}
                <View style={styles.movieInfo}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.movieTitle}>{movie.title}</Text>
                        <Text style={styles.genre}>{movie.genre}</Text>
                    </View>
                    
                    {/* Rating and Info Cards */}
                    <View style={styles.infoCards}>
                        <LinearGradient
                            colors={['#1A1A1A', 'rgba(13, 13, 13, 0.2)']}
                            style={styles.infoCard}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        >
                            <Text style={styles.infoLabel}>IMDB</Text>
                            <Text style={styles.infoValue}>⭐ {movie.rating}</Text>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#1A1A1A', 'rgba(13, 13, 13, 0.2)']}
                            style={styles.infoCard}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        >
                            <Text style={styles.infoLabel}>Year</Text>
                            <Text style={styles.infoValue}>{movie.year}</Text>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#1A1A1A', 'rgba(13, 13, 13, 0.2)']}
                            style={styles.infoCard}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        >
                            <Text style={styles.infoLabel}>Time</Text>
                            <Text style={styles.infoValue}>{movie.duration}</Text>
                        </LinearGradient>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>
                            {showFullDescription ? movie.description : movie.description.substring(0, 150)}
                            {!showFullDescription && movie.description.length > 150 && '...'}
                        </Text>
                        {movie.description.length > 150 && (
                            <TouchableOpacity onPress={toggleDescription}>
                                <Text style={styles.readMore}>
                                    {showFullDescription ? 'Read less' : 'Read more'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Top Cast */}
                    <View style={styles.castSection}>
                        <Text style={styles.castTitle}>Top cast</Text>
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
                                    <Text style={styles.castCharacter}>{actor.character}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Play Button */}
            <View style={styles.playButtonContainer}>
                <LinearGradient
                    colors={['#420000', '#160000']}
                    style={styles.playButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                >
                    <TouchableOpacity style={styles.playButtonContent} onPress={handlePlay}>
                        <Image 
                            source={require('../assets/icons/play.png')} 
                            style={styles.playIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.playButtonText}>Play</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        opacity: 1,
    },
    buttonContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#ffffff',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        opacity: 1,
    },
    headerIcon: {
        width: 20,
        height: 20,
        tintColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    posterContainer: {
        position: 'relative',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    poster: {
        width: width - 40,
        height: height * 0.4,
        borderRadius: 20,
        opacity: 1,
    },
    movieInfo: {
        flex: 1,
    },
    titleContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    movieTitle: {
        fontFamily: 'Inter',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    genre: {
        fontFamily: 'Inter',
        fontSize: 16,
        color: '#888888',
    },
    infoCards: {
        flexDirection: 'row',
        marginBottom: 24,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    infoCard: {
        width: 107,
        height: 73,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'transparent',
        paddingTop: 10,
        paddingRight: 19,
        paddingBottom: 10,
        paddingLeft: 19,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
    },
    infoLabel: {
        fontFamily: 'Inter',
        fontSize: 12,
        color: '#888888',
        marginBottom: 4,
    },
    infoValue: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    descriptionContainer: {
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    description: {
        fontFamily: 'Inter',
        fontSize: 16,
        lineHeight: 24,
        color: '#ffffff',
        marginBottom: 8,
    },
    readMore: {
        fontFamily: 'Inter',
        fontSize: 16,
        color: '#420000',
        fontWeight: '500',
    },
    castSection: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    castTitle: {
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    castList: {
        paddingHorizontal: 20,
    },
    castItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 80,
    },
    castImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    castName: {
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 2,
    },
    castCharacter: {
        fontFamily: 'Inter',
        fontSize: 10,
        color: '#888888',
        textAlign: 'center',
    },
    playButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 20,
        backgroundColor: '#000000',
        alignItems: 'center',
    },
    playButton: {
        width: 342,
        height: 50,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'transparent',
        opacity: 1,
    },
    playButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 10,
    },
    playIcon: {
        width: 24,
        height: 24,
        tintColor: '#ffffff',
    },
    playButtonText: {
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
});
