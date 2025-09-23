import withAuth from "@/lib/withAuth";

// pages/profile.tsx
type ProfileProps = {
  username: string;
};

function ProfilePage({ username }: ProfileProps) {
  return <div>Hello, {username}!</div>;
}

export default withAuth(ProfilePage);