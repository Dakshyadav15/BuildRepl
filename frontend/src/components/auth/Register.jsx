import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => { e.preventDefault(); register(formData); };

  return (
    <form onSubmit={onSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
      <h2>Register</h2>
      <input type="text" name="name" placeholder="Name" onChange={onChange} required />
      <input type="email" name="email" placeholder="Email" onChange={onChange} required />
      <input type="password" name="password" placeholder="Password" minLength="6" onChange={onChange} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;