# API Integration Setup

This directory contains the complete API integration setup for the Aeternatv mobile app using TanStack Query and Axios.

## 📁 Directory Structure

```
src/
├── api/
│   └── client.ts              # Axios client configuration
├── components/
│   └── common/                # Reusable UI components
│       ├── ErrorBoundary.tsx  # Error boundary component
│       ├── ErrorMessage.tsx   # Error message display
│       └── LoadingSpinner.tsx # Loading indicator
├── constants/
│   └── api.ts                 # API configuration and endpoints
├── hooks/
│   ├── useApi.ts              # Generic API hooks
│   └── useApiState.ts         # API state management
├── providers/
│   └── QueryProvider.tsx      # TanStack Query provider
├── services/
│   └── index.ts               # API service functions (to be populated)
├── types/
│   └── index.ts               # TypeScript type definitions
└── utils/
    ├── errorHandler.ts        # Error handling utilities
    └── queryClient.ts         # QueryClient configuration
```

## 🚀 Features

### ✅ Completed Setup
- **TanStack Query** integration with React Native
- **Axios** client with interceptors
- **TypeScript** type definitions
- **Error handling** with user-friendly messages
- **Loading states** and error boundaries
- **Caching** configuration
- **Retry logic** for failed requests
- **AsyncStorage** integration for persistence

### 🔄 Ready for Integration
- Generic API hooks (`useApiQuery`, `useApiMutation`)
- Service layer structure
- Error boundary and loading components
- Query invalidation and prefetching

## 📋 Next Steps

1. **Provide API Endpoints**: Share your API endpoints and response formats
2. **Service Implementation**: We'll create specific service functions for each endpoint
3. **Screen Refactoring**: Integrate API calls into existing screens
4. **Component Optimization**: Break down large components into smaller, reusable ones

## 🛠 Usage Examples

### Basic Query Hook
```typescript
const { data, isLoading, error } = useApiQuery(
  ['movies', 'trending'],
  { method: 'GET', url: '/movies/trending' }
);
```

### Mutation Hook
```typescript
const addToWishlist = useApiMutation(
  (variables) => ({
    method: 'POST',
    url: '/user/wishlist',
    data: variables
  })
);
```

### Error Handling
```typescript
if (error) {
  return <ErrorMessage error={error} onRetry={refetch} />;
}
```

## 🔧 Configuration

- **Base URL**: Update in `src/constants/api.ts`
- **Timeout**: Configurable in API_CONFIG
- **Cache Settings**: Adjustable in CACHE_CONFIG
- **Retry Logic**: Customizable per query

## 📱 Ready for Your Endpoints!

The infrastructure is complete and ready for your specific API endpoints. Just provide:
- Endpoint URLs
- Request/response formats
- Authentication requirements
- Any special headers or parameters

We'll integrate each feature one by one as you provide the details!
