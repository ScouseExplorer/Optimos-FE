import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Login.css';

export default function CreateAccount() {
	const navigate = useNavigate();
	const { register, getErrorMessage } = useAuth();

	const [formData, setFormData] = useState({
		email: '',
		username: '',
		password: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleChange = event => {
		const { name, value } = event.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		setError('');
		setSuccess('');
	};

	const handleSubmit = async event => {
		event.preventDefault();

		if (!formData.email.trim() || !formData.username.trim() || !formData.password.trim()) {
			setError('Complete email, username, and password to continue.');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await register({
				email: formData.email.trim(),
				username: formData.username.trim(),
				password: formData.password,
			});
			setSuccess('Account created. Redirecting to sign in...');
			setTimeout(() => navigate('/login'), 700);
		} catch (requestError) {
			setError(getErrorMessage(requestError));
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="auth-page">
			<section className="auth-card" aria-labelledby="create-account-title">
				<h1 id="create-account-title">Create your account</h1>
				<p>Set up your Optimos profile to unlock your dashboard.</p>

				<form className="auth-form" onSubmit={handleSubmit} noValidate>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="alex@company.com"
					/>

					<label htmlFor="username">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						autoComplete="username"
						value={formData.username}
						onChange={handleChange}
						placeholder="alexmorgan"
					/>

					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="new-password"
						value={formData.password}
						onChange={handleChange}
						placeholder="Create a secure password"
					/>

					{error && <p className="auth-error">{error}</p>}
					{success && <p className="auth-success">{success}</p>}

					<button type="submit" className="auth-submit" disabled={loading}>
						{loading ? 'Creating account...' : 'Create account'}
					</button>
				</form>

				<p className="auth-footnote">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</section>
		</main>
	);
}
