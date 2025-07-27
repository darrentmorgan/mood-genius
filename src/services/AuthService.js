import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class AuthService {
  constructor() {
    this.user = null;
    this.initializing = true;
    
    // Set up authentication state listener
    this.authStateChanged = this.authStateChanged.bind(this);
    this.unsubscribe = auth().onAuthStateChanged(this.authStateChanged);
  }

  // Handle authentication state changes
  authStateChanged(user) {
    console.log('🔐 Auth state changed:', user ? `User: ${user.email}` : 'No user');
    this.user = user;
    if (this.initializing) this.initializing = false;
  }

  // Get current user
  getCurrentUser() {
    return auth().currentUser;
  }

  // Sign up with email and password
  async signUp(email, password, displayName = '') {
    try {
      console.log('📝 Creating account for:', email);
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update profile with display name if provided
      if (displayName) {
        await user.updateProfile({ displayName });
      }

      // Create user document in Firestore
      await this.createUserDocument(user, { displayName });

      console.log('✅ Account created successfully for:', email);
      return { user, error: null };
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { user: null, error: this.getErrorMessage(error) };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      console.log('🔑 Signing in:', email);
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('✅ Sign in successful for:', email);
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { user: null, error: this.getErrorMessage(error) };
    }
  }

  // Sign out
  async signOut() {
    try {
      console.log('👋 Signing out user:', this.getCurrentUser()?.email);
      await auth().signOut();
      console.log('✅ Sign out successful');
      return { error: null };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      return { error: this.getErrorMessage(error) };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      console.log('🔄 Sending password reset email to:', email);
      await auth().sendPasswordResetEmail(email);
      console.log('✅ Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return { error: this.getErrorMessage(error) };
    }
  }

  // Create user document in Firestore
  async createUserDocument(user, additionalData = {}) {
    if (!user) return;

    const userRef = firestore().collection('users').doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const { displayName, email } = user;
      const createdAt = firestore.FieldValue.serverTimestamp();

      try {
        await userRef.set({
          uid: user.uid,
          displayName: displayName || additionalData.displayName || '',
          email,
          createdAt,
          ...additionalData,
        });
        console.log('✅ User document created in Firestore');
      } catch (error) {
        console.error('❌ Error creating user document:', error);
        throw error;
      }
    }
  }

  // Get user document from Firestore
  async getUserDocument(uid) {
    try {
      const userRef = firestore().collection('users').doc(uid);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting user document:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');

      // Update Firebase Auth profile
      if (updates.displayName !== undefined) {
        await user.updateProfile({ displayName: updates.displayName });
      }

      // Update Firestore document
      const userRef = firestore().collection('users').doc(user.uid);
      await userRef.update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('✅ Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return { error: this.getErrorMessage(error) };
    }
  }

  // Convert Firebase auth errors to user-friendly messages
  getErrorMessage(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or sign in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please check your email or sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  // Clean up listeners
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default new AuthService();