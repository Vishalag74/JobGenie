// src/pages/QuestionsPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateInterviewQuestions } from '../services/apiService';

function QuestionsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { role, difficulty = 'Beginner' } = location.state || {};
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!role) {
            window.location.href = '/';
            return;
        }

        const loadQuestions = async () => {
            try {
                setLoading(true);
                const generatedQuestions = await generateInterviewQuestions(role, 5, difficulty);
                setQuestions(generatedQuestions);
                setError(null);
            } catch (err) {
                setError('Failed to load questions. Please try again.');
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [role]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-3xl text-blue-600">Loading questions...</div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-3xl mx-auto w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8 text-gray-900">
                    <span className="text-blue-600">{role}</span> Interview
                </h1>
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                    <div className="mb-4">
                        <div className="bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {error ? (
                            <p className="text-sm text-red-600 mt-2">
                                {error}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600 mt-2">
                                Question {currentIndex + 1} of {questions.length}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 md:mb-4">{currentQuestion?.text}</h2>
                        <textarea
                            value={currentQuestion ? answers[currentQuestion.id] || '' : ''}
                            onChange={(e) => {
                                if (!currentQuestion) return; // prevent crash
                                setAnswers((prev) => ({
                                    ...prev,
                                    [currentQuestion.id]: e.target.value,
                                }));
                            }}
                            placeholder="Type your answer here..."
                            className="w-full h-32 md:h-40 p-3 border border-gray-300 rounded-lg resize-none text-sm md:text-base"
                        />
                    </div>

                    <button
                        onClick={() => {
                            if (currentIndex === questions.length - 1) {
                                navigate('/feedback', { state: { answers, role } });
                            } else {
                                setCurrentIndex((prev) => prev + 1);
                            }
                        }}
                        disabled={!answers[currentQuestion?.id]?.trim()}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                        {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuestionsPage;
