
import { useState, useEffect } from "react";
import { checkInstagramCredentials } from "@/services/instagramService";

export const useInstagramCredentials = () => {
  const [hasCredentials, setHasCredentials] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState<string | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkCredentials = async () => {
      setIsChecking(true);
      try {
        const { hasCredentials, username } = await checkInstagramCredentials();
        setHasCredentials(hasCredentials);
        setInstagramUsername(username);
      } catch (error) {
        console.error("Erro ao verificar credenciais do Instagram:", error);
        setHasCredentials(false);
        setInstagramUsername(undefined);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkCredentials();
  }, []);

  return { 
    hasCredentials, 
    instagramUsername, 
    isChecking 
  };
};
