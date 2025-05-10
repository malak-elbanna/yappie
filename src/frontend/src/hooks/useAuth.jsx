import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const useAuth = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token); 
        setUserId(decoded.sub);
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }
  }, []);

  return { userId };
};

export default useAuth;
