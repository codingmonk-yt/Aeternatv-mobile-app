import { useCallback, useState } from 'react';

export interface ApiState {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isSuccess: boolean;
}

export const useApiState = (initialState: Partial<ApiState> = {}) => {
  const [state, setState] = useState<ApiState>({
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
    ...initialState,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: any) => {
    setState(prev => ({ 
      ...prev, 
      isError: true, 
      error, 
      isLoading: false,
      isSuccess: false,
    }));
  }, []);

  const setSuccess = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isSuccess: true, 
      isLoading: false, 
      isError: false, 
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    reset,
  };
};
