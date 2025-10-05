import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';

function HomePage() {
    return (
        <div className="relative min-h-screen flex items-center justify-start p-12">
            <img
                src={heroImage}
                alt="Hero Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="relative z-20 max-w-6xl flex flex-col md:flex-row items-center md:items-start">
                <div className="md:flex-1 text-left text-gray-900 ">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 sm:mb-8 leading-tight">
                        Welcome to <span className="text-blue-700">JobGenie</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-900 mb-8 sm:mb-12 max-w-2xl">
                        Practice interviews with AI-powered questions and get instant feedback
                    </p>
                    <div className="text-center mt-10">
                        <Link
                            to="/role-selection"
                            className=" bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold transition-transform duration-200 hover:scale-105 inline-block shadow-lg"
                        >
                            Get Started 🚀 
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
