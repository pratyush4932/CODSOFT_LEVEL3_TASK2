import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { authAPI } from '../services/api';

const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        let token, user;
        
        if (response && typeof response === 'object') {
          if (response.accesstoken) {
            token = response.accesstoken;
            try {
              const userInfo = await authAPI.getUserInfo(token);
              if (userInfo && userInfo._id) {
                user = userInfo;
              } else {
                throw new Error('Invalid user data received');
              }
            } catch (userError) {
              user = {
                email: formData.email,
                name: formData.email.split('@')[0],
                _id: null
              };
              
              try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                if (tokenPayload.id) {
                  user._id = tokenPayload.id;
                }
              } catch (tokenError) {
                user._id = Date.now().toString();
              }
            }
          }
          else if (response.token && response.user) {
            token = response.token;
            user = response.user;
          }
          else if (response.authToken && response.user) {
            token = response.authToken;
            user = response.user;
          }
          else if (response.accessToken && response.user) {
            token = response.accessToken;
            user = response.user;
          }
          else if (response.jwt && response.user) {
            token = response.jwt;
            user = response.user;
          }
          else if (response._id && response.email && response.token) {
            token = response.token;
            user = response;
          }
          else if (response._id && response.email && response.authToken) {
            token = response.authToken;
            user = response;
          }
          else if (response._id && response.email && response.accessToken) {
            token = response.accessToken;
            user = response;
          }
          else if (response._id && response.email && response.jwt) {
            token = response.jwt;
            user = response;
          }
          else if (response._id && response.email) {
            user = response;
            token = response.token || response.authToken || response.accessToken || response.jwt;
            if (token) {
            } else {
            }
          }
          else {
            const possibleTokenProps = ['token', 'authToken', 'accessToken', 'jwt', 'authorization', 'auth', 'accesstoken'];
            for (const prop of possibleTokenProps) {
              if (response[prop]) {
                token = response[prop];
                break;
              }
            }
            if (response.user || response.userData || response.userInfo) {
              user = response.user || response.userData || response.userInfo;
            }
          }
        }
        if (!token || !user) {
          throw new Error(`Invalid response format from server. Response: ${JSON.stringify(response)}`);
        }
        
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('projectManagerUser', JSON.stringify(user));
        
        onLogin(user);
      } catch (error) {
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setErrors({ general: errorMessage });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-gradient text-white rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-kanban" style={{ fontSize: '28px', lineHeight: 1 }}></i>
                  </div>
                  <h3 className="fw-bold text-dark mb-1">TaskNest</h3>
                  <p className="text-muted mb-0">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {errors.general && (
                    <div className="alert alert-danger py-2 mb-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {errors.general}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={18} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <div className="invalid-feedback d-block">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={18} className="text-muted" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block">{errors.password}</div>
                    )}
                  </div>

                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>

                  
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Don't have an account?{' '}
                    <button
                      className="btn btn-link text-decoration-none p-0"
                      onClick={onSwitchToRegister}
                    >
                      Create Account
                    </button>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
