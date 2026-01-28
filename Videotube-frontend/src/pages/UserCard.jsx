import { useSelector } from "react-redux";
import Avatar from "../components/shared/Avatar/Avatar";
import Container from "../components/shared/Container/Container";

function UserCard() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <Container>
        <p className="text-center text-gray-500">Loading user...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-32 bg-gray-200">
          {user.coverImage && (
            <img
              src={user.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Avatar + Info */}
        <div className="p-6 flex items-center space-x-4">
          <Avatar src={user.avatar} alt={user.username} size="xl" />
          <div>
            <h2 className="text-xl font-bold">{user.fullname}</h2>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default UserCard;
