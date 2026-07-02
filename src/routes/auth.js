const { Router } = require('express');
const {
  sendOtp,
  verifyOtp,
  register,
  registerWithLegacyLink,
  login,
  loginRequest,
  loginWithOtp,
  checkPhone,
  getProfile,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.post('/otp/send', validate({
  phone: ['required', 'phone'],
}), sendOtp);

router.post('/otp/verify', validate({
  phone: ['required', 'phone'],
  code: ['required', { minLength: 4 }],
}), verifyOtp);

router.post('/register', validate({
  first_name: ['required'],
  last_name: ['required'],
  phone: ['required', 'phone'],
  password: ['required', { minLength: 6 }],
}), register);

router.post('/register/legacy', validate({
  phone: ['required', 'phone'],
  password: ['required', { minLength: 6 }],
}), registerWithLegacyLink);

router.post('/login', validate({
  phone: ['required', 'phone'],
  password: ['required'],
}), login);

router.post('/login-request', validate({
  first_name: ['required'],
  last_name: ['required'],
  password: ['required'],
}), loginRequest);

router.post('/login-otp', validate({
  phone: ['required', 'phone'],
  code: ['required', { minLength: 4 }],
}), loginWithOtp);

router.post('/forgot-password', validate({
  phone: ['required', 'phone'],
}), forgotPassword);

router.post('/reset-password', validate({
  phone: ['required', 'phone'],
  code: ['required', { minLength: 4 }],
  new_password: ['required', { minLength: 6 }],
}), resetPassword);

if (process.env.NODE_ENV !== 'production') {
  const { generateToken } = require('../middleware/auth');
  router.post('/dev-login', (req, res) => {
    const { role } = req.body;
    const token = generateToken({ id: 'dev-user-id', role: role || 'client', phone: '+212600000001' });
    res.json({
      user: {
        id: 'dev-user-id',
        unique_id: 'MW-DEV0001',
        role: role || 'client',
        first_name: 'Test',
        last_name: 'User',
        phone: '+212600000001',
        email: 'test@medwell.ma',
        preferred_lang: 'en',
        wellness_coin_balance: 100,
      },
      token,
      membership_card: {
        unique_id: 'MW-DEV0001',
        name: 'Test User',
        phone: '+212600000001',
      },
    });
  });
}

router.get('/check-phone/:phone', optionalAuth, checkPhone);

router.get('/profile', authenticate, getProfile);

router.post('/refresh', authenticate, refreshToken);

module.exports = router;
