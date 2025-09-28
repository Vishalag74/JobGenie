import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoleSelectionPage() {
    const [selectedRole, setSelectedRole] = useState('');
    const [customRole, setCustomRole] = useState('');
    const [difficulty, setDifficulty] = useState('Beginner');
    const navigate = useNavigate();

    const commonRoles = [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Data Analyst',
        'Data Scientist',
        'DevOps Engineer',
        'Product Manager',
        'UI/UX Designer',
        'Software Engineer',
    ];

    const handleStart = () => {
        const role = customRole || selectedRole;
        if (role) {
            navigate('/questions', { state: { role, difficulty } });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8 text-gray-900">
                    <span className="text-blue-600">Select </span>Your Role
                </h1>

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                    <div className="mb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 items-center">
                            <button className="font-bold text-gray-900 p-3 md:p-4 rounded-lg border-2 text-sm md:text-base border-none">Difficulty Level:</button>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="md:col-span-2 p-3 border border-blue-500 bg-blue-50 text-blue-700 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Beginner">Beginner - Basic concepts</option>
                                <option value="Intermediate">Intermediate - Standard questions</option>
                                <option value="Advanced">Advanced - Complex topics</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                        {commonRoles.map((role) => (
                            <button
                                key={role}
                                onClick={() => {
                                    setSelectedRole(role);
                                    setCustomRole('');
                                }}
                                className={`p-3 md:p-4 rounded-lg border-2 text-sm md:text-base transition-all ${selectedRole === role
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        value={customRole.replace(/\b\w/g, char => char.toUpperCase())}
                        onChange={(e) => {
                            setCustomRole(e.target.value.replace(/\b\w/g, char => char.toUpperCase()));
                            setSelectedRole('');
                        }}
                        placeholder="Or enter custom role..."
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm md:text-base"
                    />

                    <button
                        onClick={handleStart}
                        disabled={!selectedRole && !customRole}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                        Start Interview
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoleSelectionPage;
