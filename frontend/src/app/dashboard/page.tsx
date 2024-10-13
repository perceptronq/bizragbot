import { useSession } from '../../lib/useSession';

export const Dashboard: React.FC = () => {
    const user = useSession();

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <p>Welcome, {user.email}</p>
            ) : (
                <p>Please log in to see your dashboard.</p>
            )}
        </div>
    );
};
