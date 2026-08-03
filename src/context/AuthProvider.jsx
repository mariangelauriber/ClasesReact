import { useEffect, useState } from "react";
import { subscribeToAuthState } from "../services/authService";
import { subscribeToCitizenProfile } from "../services/citizenService";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [profileState, setProfileState] = useState({ uid: null, profile: null, error: null });

  useEffect(() => {
    const unsubscribeAuth = subscribeToAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setLoadingAuth(false);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const unsubscribeProfile = subscribeToCitizenProfile(
      user.uid,
      (data) => {
        setProfileState({ uid: user.uid, profile: data, error: null });
      },
      () => {
        setProfileState({
          uid: user.uid,
          profile: null,
          error: "No se pudo cargar tu perfil. Revisa la configuración de Firebase.",
        });
      },
    );
    return unsubscribeProfile;
  }, [user]);

  const profileMatchesUser = Boolean(user) && profileState.uid === user.uid;
  const profile = profileMatchesUser ? profileState.profile : null;
  const profileError = profileMatchesUser ? profileState.error : null;

  const value = {
    user,
    profile,
    role: profile?.role ?? null,
    isAdmin: profile?.role === "admin",
    profileError,
    loading: loadingAuth || (Boolean(user) && !profileMatchesUser),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
