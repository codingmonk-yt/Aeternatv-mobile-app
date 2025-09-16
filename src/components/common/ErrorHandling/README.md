# Error Handling System

A comprehensive error handling system for the Aeternatv mobile app that provides graceful error screens, network detection, retry mechanisms, and offline mode support.

## Features

- **Specific Error Screens**: Custom screens for different error types (Network, Server, Timeout, Offline)
- **Network Detection**: Real-time network connectivity monitoring
- **Smart Retry**: Exponential backoff retry mechanism
- **Offline Mode**: Cached content display when offline
- **Error Context**: Global error state management
- **HOC Integration**: Easy integration with existing components

## Components

### Error Screens

#### NetworkErrorScreen
Displays when there's no internet connection with helpful tips and retry options.

```tsx
import { NetworkErrorScreen } from '../ErrorScreens';

<NetworkErrorScreen
  onRetry={() => refetchData()}
  onGoOffline={() => setOfflineMode(true)}
  title="No Internet Connection"
  message="Please check your internet connection and try again."
/>
```

#### ServerErrorScreen
Shows when server errors occur (5xx status codes) with error codes and retry options.

```tsx
import { ServerErrorScreen } from '../ErrorScreens';

<ServerErrorScreen
  onRetry={() => refetchData()}
  onGoBack={() => navigation.goBack()}
  title="Server Error"
  message="Our servers are experiencing issues."
  errorCode="500"
/>
```

#### TimeoutErrorScreen
Displays when requests timeout with connection tips.

```tsx
import { TimeoutErrorScreen } from '../ErrorScreens';

<TimeoutErrorScreen
  onRetry={() => refetchData()}
  onGoBack={() => navigation.goBack()}
  title="Request Timeout"
  message="The request is taking longer than expected."
/>
```

#### OfflineModeScreen
Shows cached content when offline with available features.

```tsx
import { OfflineModeScreen } from '../ErrorScreens';

<OfflineModeScreen
  onRetry={() => checkConnection()}
  onGoBack={() => navigation.goBack()}
  cachedContent={recentlyViewed}
  title="You're Offline"
  message="Here's what you can still access."
/>
```

### Hooks

#### useNetworkStatus
Monitors network connectivity in real-time.

```tsx
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

function MyComponent() {
  const { isOnline, isConnected, type } = useNetworkStatus();
  
  if (!isOnline) {
    return <OfflineModeScreen />;
  }
  
  return <YourContent />;
}
```

#### useRetry
Provides smart retry functionality with exponential backoff.

```tsx
import { useRetry } from '../../hooks/useRetry';

function MyComponent() {
  const { retry, isRetrying, canRetry, attempt } = useRetry({
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
  });

  const handleRetry = async () => {
    try {
      await retry(() => fetchData());
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleRetry} disabled={!canRetry}>
      <Text>{isRetrying ? `Retrying... (${attempt})` : 'Retry'}</Text>
    </TouchableOpacity>
  );
}
```

#### useOfflineMode
Manages offline mode and cached content.

```tsx
import { useOfflineMode } from '../../hooks/useOfflineMode';

function MyComponent() {
  const { 
    isOfflineMode, 
    cachedContent, 
    addToRecentlyViewed,
    addToWishlist 
  } = useOfflineMode();

  const handleContentPress = (content) => {
    addToRecentlyViewed({
      id: content.id,
      title: content.title,
      type: 'Movie',
      image: content.image,
    });
  };

  if (isOfflineMode) {
    return <OfflineModeScreen cachedContent={cachedContent} />;
  }

  return <YourContent onPress={handleContentPress} />;
}
```

### Context

#### ErrorContext
Global error state management.

```tsx
import { useError } from '../../contexts/ErrorContext';

function MyComponent() {
  const { showError, hideError, error } = useError();

  const handleApiCall = async () => {
    try {
      await apiCall();
    } catch (error) {
      showError(ErrorType.NETWORK, 'Failed to load data');
    }
  };

  return (
    <View>
      {error.isVisible && (
        <ErrorHandler error={error} onRetry={handleApiCall} />
      )}
    </View>
  );
}
```

### Higher-Order Component

#### withErrorHandling
Easily add error handling to any component.

```tsx
import { withErrorHandling } from '../withErrorHandling';

function MyComponent({ data, error, onRetry }) {
  return (
    <View>
      {/* Your component content */}
    </View>
  );
}

// Export with error handling
export default withErrorHandling(MyComponent);
```

## Usage Examples

### Basic Integration

```tsx
// 1. Wrap your app with providers
import { ReduxProvider } from '../src/providers/ReduxProvider';

export default function App() {
  return (
    <ReduxProvider>
      <YourApp />
    </ReduxProvider>
  );
}

// 2. Use error handling in components
import { withErrorHandling } from '../src/components/common/withErrorHandling';

function HomePage({ onRetry }) {
  const { data, error, isLoading } = useApi();

  if (isLoading) return <LoadingSpinner />;

  return (
    <View>
      {/* Your content */}
    </View>
  );
}

export default withErrorHandling(HomePage);
```

### Advanced Error Handling

```tsx
import { useError } from '../src/contexts/ErrorContext';
import { useRetry } from '../src/hooks/useRetry';
import { ErrorType } from '../src/utils/errorHandler';

function AdvancedComponent() {
  const { showError } = useError();
  const { retry, isRetrying } = useRetry({
    maxRetries: 5,
    initialDelay: 2000,
    onMaxRetriesReached: () => {
      showError(ErrorType.SERVER_ERROR, 'Max retries reached. Please try again later.');
    },
  });

  const handleDataFetch = async () => {
    try {
      await retry(() => fetchData());
    } catch (error) {
      const errorType = parseError(error).code;
      showError(errorType, 'Failed to load data');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleDataFetch} disabled={isRetrying}>
        <Text>{isRetrying ? 'Retrying...' : 'Load Data'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Custom Error Screen

```tsx
import { ErrorHandler } from '../src/components/common/ErrorHandler';

function CustomErrorPage() {
  const [error, setError] = useState(null);

  return (
    <ErrorHandler
      error={error}
      onRetry={() => setError(null)}
      onGoBack={() => navigation.goBack()}
      onGoOffline={() => setOfflineMode(true)}
      cachedContent={cachedItems}
    />
  );
}
```

## Error Types

The system handles these error types:

- `NETWORK`: No internet connection
- `TIMEOUT`: Request timeout
- `UNAUTHORIZED`: 401 Unauthorized
- `FORBIDDEN`: 403 Forbidden
- `NOT_FOUND`: 404 Not Found
- `SERVER_ERROR`: 5xx Server errors
- `VALIDATION`: 400 Bad Request
- `UNKNOWN`: Other errors

## Configuration

### Retry Configuration

```tsx
const retryConfig = {
  maxRetries: 3,           // Maximum retry attempts
  initialDelay: 1000,      // Initial delay in ms
  maxDelay: 10000,         // Maximum delay in ms
  backoffMultiplier: 2,    // Delay multiplier for each retry
  onRetry: (attempt) => {}, // Callback on each retry
  onMaxRetriesReached: () => {}, // Callback when max retries reached
};
```

### Network Detection

The system automatically detects:
- Internet connectivity
- Connection type (WiFi, cellular, etc.)
- Real-time status changes

### Offline Mode

When offline, the system:
- Shows cached content
- Provides offline features
- Offers retry when connection returns
- Maintains user preferences

## Best Practices

1. **Always wrap components with error handling** when making API calls
2. **Use appropriate error types** for better user experience
3. **Provide meaningful error messages** to users
4. **Implement retry mechanisms** for transient errors
5. **Cache important content** for offline access
6. **Test error scenarios** thoroughly

## Troubleshooting

### Common Issues

1. **Error screens not showing**: Ensure ErrorProvider is wrapped around your app
2. **Network detection not working**: Check if @react-native-community/netinfo is installed
3. **Retry not working**: Verify retry configuration and error types
4. **Offline mode not working**: Check AsyncStorage permissions and cache implementation

### Debug Mode

Enable debug logging:

```tsx
// In your app configuration
console.log('Error handling debug mode enabled');
```

This will log all error handling activities to help with debugging.


