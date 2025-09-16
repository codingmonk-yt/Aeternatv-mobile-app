import React from 'react';
import { Provider } from 'react-redux';
import { ErrorProvider } from '../contexts/ErrorContext';
import { store } from '../store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ErrorProvider>
        {children}
      </ErrorProvider>
    </Provider>
  );
};
