import { Link } from 'react-router-dom';
import Button from '../components/shared/Button/Button';
import Container from '../components/shared/Container/Container';

function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Container>
                <div className="text-center">
                    <div className="text-6xl font-bold text-indigo-300 mb-4">404</div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                        Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </p>
                    <Button size="lg">
                        <Link to="/">
                            Go Back Home
                        </Link>
                    </Button>
                </div>
            </Container>
        </div>
    );
}

export default NotFound;