import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { generateFeedback } from '../services/apiService';

function FeedbackPage() {
    const location = useLocation();
    const { answers, role } = location.state || {};
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!answers || !role) {
            window.location.href = '/';
            return;
        }

        const loadFeedback = async () => {
            try {
                setLoading(true);
                const generatedFeedback = await generateFeedback(role, answers);
                setFeedback(generatedFeedback);
                setError(null);
            } catch (err) {
                setError('Failed to generate feedback. Please try again.');
                setFeedback(null);
            } finally {
                setLoading(false);
            }
        };

        loadFeedback();
    }, [answers, role]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-3xl text-blue-600">Generating feedback...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-5xl mx-auto w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8 text-gray-900">
                    Interview <span className="text-blue-600">Complete</span>
                </h1>
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                    <div className="text-center mb-4 md:mb-6">
                        {error ? (
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4">{error}</h2>
                        ) : (
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4">🎉 Great job completing the interview!</h2>
                        )}
                    </div>
                    {feedback && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Overall Score: {feedback.overallScore}/100</h3>
                                <p className="text-gray-700">{feedback.summary}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Strengths</h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {feedback.strengths?.map((strength, index) => (
                                            <li key={index}>{strength}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Areas for Improvement</h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {feedback.improvements?.map((improvement, index) => (
                                            <li key={index}>{improvement}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Suggestions</h3>
                                <p className="text-gray-700">{feedback.suggestions}</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center mt-6 md:mt-8">
                        <Link
                            to="/role-selection"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 text-sm md:text-base"
                        >
                            Practice Again
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedbackPage;
