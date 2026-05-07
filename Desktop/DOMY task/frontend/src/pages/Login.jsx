import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert } from '../components/ui/alert';

export default function Login(){
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) { setError('Please enter username/email and password'); return; }
    try {
      setLoading(true);
      await login(identifier, password);
      toast.success('Login successful');
      nav('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Access your saved bookmarks and the latest stories.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="auth-form">
            <div className="form-row">
              <Label htmlFor="login-identifier">Username or Email</Label>
              <Input id="login-identifier" type="text" placeholder="username or email" value={identifier} onChange={e=>setIdentifier(e.target.value)} />
            </div>
            <div className="form-row">
              <Label htmlFor="login-password">Password</Label>
              <Input id="login-password" type="password" placeholder="your password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            {error && <Alert variant="destructive">{error}</Alert>}
            <div className="form-row">
              <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
            </div>
            <div className="muted">No account? <Link to="/register">Register</Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
