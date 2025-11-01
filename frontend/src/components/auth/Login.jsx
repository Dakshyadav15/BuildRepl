import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => { e.preventDefault(); login(formData); };

  return (
    <form onSubmit={onSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email" onChange={onChange} required />
      <input type="password" name="password" placeholder="Password" onChange={onChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;