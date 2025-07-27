import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false, error: null, errorInfo: null};
    console.log('🔧 ErrorBoundary: Constructor called');
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 ErrorBoundary: getDerivedStateFromError', error);
    return {hasError: true, error, errorInfo: null};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary: componentDidCatch');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      console.log('🚨 ErrorBoundary: Rendering error screen');
      return (
        <ScrollView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.title}>Something went wrong! 🚨</Text>
            <Text style={styles.subtitle}>Error Details:</Text>
            <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
            
            <Text style={styles.subtitle}>Stack Trace:</Text>
            <Text style={styles.stackText}>{this.state.error?.stack}</Text>
            
            {this.state.errorInfo && (
              <>
                <Text style={styles.subtitle}>Component Stack:</Text>
                <Text style={styles.stackText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </>
            )}
            
            <Text style={styles.footer}>
              Check the Metro logs for more details.
            </Text>
          </View>
        </ScrollView>
      );
    }

    console.log('✅ ErrorBoundary: Rendering children normally');
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6b6b',
  },
  errorContainer: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'monospace',
  },
  stackText: {
    fontSize: 12,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'monospace',
  },
  footer: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default ErrorBoundary;