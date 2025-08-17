import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                    Welcome to <span className="text-blue-600">JobGenie</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
                    Practice interviews with AI-powered questions and get instant feedback
                </p>
                <Link
                    to="/role-selection"
                    className="bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 hover:scale-102 transition-transform duration-200 inline-block"
                >
                    🚀 Start Interview Practice
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
