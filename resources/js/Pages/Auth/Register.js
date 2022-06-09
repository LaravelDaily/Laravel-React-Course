import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('/register', { name, email, password, password_confirmation })
            .then(response => navigate('/posts'))
            .catch(error => {
                setErrors(Object.entries(error.response.data.errors))
            })
    }

    return (
        <div>
            { errors.length > 0 && <div>
                <div className="font-medium text-red-600">
                    Whoops! Something went wrong.
                </div>

                <ul className="mt-3 mb-4 list-disc list-inside text-sm text-red-600">
                    { errors.map((error, index) => {
                        return (
                            <li key={index}>{error[1][0]}</li>
                        )
                    }) }
                </ul>
            </div> }

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name" className="block font-medium text-sm text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => { setName(e.target.value)} }
                        className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                        autoFocus
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="email" className="block font-medium text-sm text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value)} }
                        className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <label htmlFor="password" className="block font-medium text-sm text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value)} }
                        className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <label htmlFor="password_confirmation" className="block font-medium text-sm text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={password_confirmation}
                        onChange={(e) => { setPasswordConfirmation(e.target.value)} }
                        className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <button type="submit" className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ml-3">
                        Register
                    </button>
                </div>
            </form>
        </div>
    )
}
