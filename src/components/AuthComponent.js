// === COMPOSANT D'AUTHENTIFICATION POUR OROYO ===

import React, { useState, useEffect } from 'react';
import { 
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase'; // Correction du chemin d'importation
import { User, Mail, Eye, EyeOff, LogOut, UserPlus } from 'lucide-react';

// === COMPOSANT MODAL D'AUTHENTIFICATION ===
const AuthModal = ({ showAuthModal, setShowAuthModal, onAuthSuccess, onClose, onSuccess }) => {
  // Support pour les deux types de props
  const closeModal = setShowAuthModal ? (() => setShowAuthModal(false)) : onClose;
  const successCallback = onAuthSuccess || onSuccess;
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log('🔄 Tentative de connexion Google...');
    setAuthLoading(true);
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      console.log('🔧 Provider Google créé:', provider);
      console.log('🔧 Auth object:', auth);
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Connexion Google réussie:', result.user.displayName);
      if (closeModal) closeModal();
      if (successCallback) successCallback(result.user);
    } catch (error) {
      console.error('❌ Erreur Google complète:', error);
      console.error('❌ Code d\'erreur:', error.code);
      console.error('❌ Message d\'erreur:', error.message);
      setAuthError(`Erreur lors de la connexion avec Google: ${error.message}`);
    }
    setAuthLoading(false);
  };

  const handleAnonymousSignIn = async () => {
    console.log('🔄 Tentative de connexion anonyme...');
    setAuthLoading(true);
    setAuthError('');
    try {
      console.log('🔧 Auth object pour anonyme:', auth);
      const result = await signInAnonymously(auth);
      console.log('✅ Connexion anonyme réussie:', result.user);
      if (closeModal) closeModal();
      if (successCallback) successCallback(result.user);
    } catch (error) {
      console.error('❌ Erreur connexion anonyme complète:', error);
      console.error('❌ Code d\'erreur:', error.code);
      console.error('❌ Message d\'erreur:', error.message);
      setAuthError(`Erreur lors de la connexion anonyme: ${error.message}`);
    }
    setAuthLoading(false);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Connexion email réussie:', result.user.email);
      if (closeModal) closeModal();
      resetForm();
      if (successCallback) successCallback(result.user);
    } catch (error) {
      console.error('❌ Erreur connexion email:', error);
      setAuthError('Email ou mot de passe incorrect');
    }
    setAuthLoading(false);
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil avec le nom
      if (displayName) {
        await updateProfile(result.user, {
          displayName: displayName
        });
      }
      
      console.log('✅ Inscription réussie:', result.user.email);
      if (closeModal) closeModal();
      resetForm();
      if (successCallback) successCallback(result.user);
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('Cette adresse email est déjà utilisée');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Le mot de passe doit contenir au moins 6 caractères');
      } else {
        setAuthError('Erreur lors de l\'inscription');
      }
    }
    setAuthLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setAuthError('');
  };

  // Vérifier si le modal doit être affiché
  const shouldShow = showAuthModal !== undefined ? showAuthModal : true;
  if (!shouldShow) return null;
  
  console.log('🔄 Rendu du modal d\'authentification');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        border: '1px solid #334155'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            color: '#e2e8f0', 
            marginBottom: '0.5rem',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {authMode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Rejoignez la communauté citoyenne de Guyane
          </p>
        </div>

        {/* Onglets */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          padding: '0.25rem'
        }}>
          <button
            onClick={() => setAuthMode('login')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: authMode === 'login' ? '#3b82f6' : 'transparent',
              color: authMode === 'login' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => setAuthMode('register')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: authMode === 'register' ? '#3b82f6' : 'transparent',
              color: authMode === 'register' ? 'white' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Inscription
          </button>
        </div>

        {/* Boutons de connexion rapide */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: authLoading ? 'not-allowed' : 'pointer',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Mail size={18} />
            Continuer avec Google
          </button>

          <button
            onClick={handleAnonymousSignIn}
            disabled={authLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: authLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <User size={18} />
            Continuer anonymement
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>ou</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
        </div>

        {/* Formulaire email */}
        <form onSubmit={authMode === 'login' ? handleEmailLogin : handleEmailRegister}>
          {authMode === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                color: '#e2e8f0', 
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Nom complet
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre nom"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#e2e8f0', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#e2e8f0', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {authError && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#ef4444',
              fontSize: '0.875rem'
            }}>
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: authLoading ? 'not-allowed' : 'pointer',
              opacity: authLoading ? 0.7 : 1
            }}
          >
            {authLoading ? '⏳ Chargement...' : (authMode === 'login' ? 'Se connecter' : 'Créer un compte')}
          </button>
        </form>

        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

// === COMPOSANT BOUTON UTILISATEUR ===
const UserButton = ({ user, onSignOut, onSignIn }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) {
    return (
      <button
        onClick={onSignIn}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <UserPlus size={18} />
        Se connecter
      </button>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: '#e2e8f0',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {user.isAnonymous ? '👤' : (user.displayName ? user.displayName[0].toUpperCase() : '👤')}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
            {user.isAnonymous ? 'Utilisateur anonyme' : (user.displayName || 'Citoyen')}
          </div>
          {!user.isAnonymous && user.email && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {user.email}
            </div>
          )}
        </div>
      </button>

      {showUserMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '8px',
          minWidth: '200px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          zIndex: 100
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
            <div style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '0.25rem' }}>
              {user.isAnonymous ? 'Utilisateur anonyme' : (user.displayName || 'Citoyen')}
            </div>
            {!user.isAnonymous && user.email && (
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                {user.email}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onSignOut();
              setShowUserMenu(false);
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};

// === HOOK D'AUTHENTIFICATION ===
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      console.log('👤 État utilisateur:', user ? `${user.displayName || 'Anonyme'} (${user.email || 'anonyme'})` : 'Non connecté');
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
    }
  };

  return { user, loading, signOut: signOutUser };
};

// === EXPORT DES COMPOSANTS ===
export { AuthModal, UserButton };
