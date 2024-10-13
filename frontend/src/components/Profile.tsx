import { useSession } from '../lib/useSession';
import { signOut } from '../lib/auth';

export const Profile: React.FC = () => {
  const user = useSession();

  const handleLogout = async () => {
    await signOut();
    window.location.reload(); 
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user.email}</h2>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

