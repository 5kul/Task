import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert } from '../components/ui/alert';

export default function Register(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) { setError('Please provide username, email and password'); return; }
    try {
      setLoading(true);
      await register(username, email, password);
      toast.success('Registration successful');
      nav('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Register to bookmark stories and keep track of your reads.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="auth-form">
            <div className="form-row">
              <Label htmlFor="register-username">Username</Label>
              <Input id="register-username" type="text" placeholder="choose a username" value={username} onChange={e=>setUsername(e.target.value)} />
            </div>
            <div className="form-row">
              <Label htmlFor="register-email">Email</Label>
              <Input id="register-email" type="email" placeholder="your email" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="form-row">
              <Label htmlFor="register-password">Password</Label>
              <Input id="register-password" type="password" placeholder="create a password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            {error && <Alert variant="destructive">{error}</Alert>}
            <div className="form-row">
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
            </div>
            <div className="muted">Already have an account? <Link to="/login">Login</Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
