import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscribedChannels } from "../features/subscription/subscriptionSlice";
import Spinner from "../components/shared/Spinner/Spinner";
import Container from "../components/shared/Container/Container";
import { Link, useNavigate } from "react-router-dom";
import { Users, WifiOff } from "lucide-react"; // Using lucide-react for icons, you can use any library

function Subscriptions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?._id);
  const { subscribedChannels = [], status, error } = useSelector(
    (state) => state.subscription
  );
  const { isAuthenticated } = useSelector(state => state.auth);
 
     useEffect(() => {
         if (!isAuthenticated) {
             toast.error("Please login to continue")
             navigate('/login');
         }
     }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userId) dispatch(getSubscribedChannels(userId));
  }, [dispatch, userId]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <WifiOff size={48} className="text-red-500" />
        <h2 className="mt-4 text-xl font-semibold">Something went wrong</h2>
        <p className="text-gray-500">{error}</p>
        <button
          onClick={() => {
            if (userId) dispatch(getSubscribedChannels(userId));
          }}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Container>
      <div className="px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gradient">
          Your Subscriptions
        </h1>

        {subscribedChannels.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {subscribedChannels.map((sub) => (
              <Link
                key={sub._id}
                to={`/channel/${sub.channelDetails.username}`}
                className="group flex flex-col items-center rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={sub.channelDetails.avatar || "/default-avatar.png"}
                  alt={`${sub.channelDetails.username}'s avatar`}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-white transition-transform duration-300 group-hover:scale-105"
                />
                <div className="mt-4">
                  <h3 className="text-xl md:text-xl font-bold mt-2 md:mt-6 text-gradient">
                    {sub.channelDetails.fullName}
                  </h3> 
                  <p className="text-sm text-gray-500">
                    @{sub.channelDetails.username}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                    <Users size={12} />
                    <span>
                      {sub.channelDetails.subscribersCount || 0} Subscribers
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 py-20 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No Subscriptions Yet!
            </h2>
            <p className="mt-2 text-gray-500">
              Videos from your favorite channels will appear here.
            </p>
            <Link
              to="/" 
              className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Explore Channels
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}

export default Subscriptions;