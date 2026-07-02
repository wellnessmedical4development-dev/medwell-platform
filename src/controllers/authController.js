const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OtpCode = require('../models/OtpCode');
const LegacyClient = require('../models/LegacyClient');
const Prospect = require('../models/Prospect');
const { generateToken } = require('../middleware/auth');
const { generateEncryptedId } = require('../utils/idGenerator');
const { sendSMS, sendWhatsApp } = require('../services/smsService');

const SALT_ROUNDS = 12;

async function sendOtp(req, res) {
  try {
    const { phone, purpose = 'registration' } = req.body;
    const cleaned = phone.replace(/[^0-9+]/g, '');

    if (purpose === 'registration') {
      const existingUser = await User.findByPhone(cleaned);
      if (existingUser) {
        return res.status(409).json({ error: req.t('errors.phone_exists') });
      }
    }

    const { code } = await OtpCode.create(cleaned, purpose);
    const message = `MedWell: Votre code de vérification est ${code}. Valable 5 minutes.`;

    console.log(`[SIMULATION] OTP for ${cleaned}: ${code}`);

    res.json({
      message: req.t('auth.otp_sent'),
      phone: cleaned,
      dev_code: code,
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function verifyOtp(req, res) {
  try {
    const { phone, code, purpose = 'registration' } = req.body;
    const cleaned = phone.replace(/[^0-9+]/g, '');

    const otp = await OtpCode.verify(cleaned, code, purpose);
    if (!otp) {
      const { rows } = await require('../config/database').query(
        'SELECT attempts FROM otp_codes WHERE phone = ? AND purpose = ? AND verified = FALSE ORDER BY created_at DESC LIMIT 1',
        [cleaned, purpose]
      );
      if (rows[0] && rows[0].attempts >= 3) {
        return res.status(429).json({ error: 'Trop de tentatives. Veuillez renvoyer un nouveau code.' });
      }
      return res.status(400).json({ error: req.t('errors.invalid_otp') });
    }

    const otpToken = generateToken(
      { phone: cleaned, otp_verified: true, purpose },
      { expiresIn: '10m' }
    );

    res.json({
      message: req.t('auth.otp_verified'),
      phone: cleaned,
      otp_token: otpToken,
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function register(req, res) {
  try {
    const { first_name, last_name, email, phone, password, preferred_lang, otp_token } = req.body;
    const lang = req.language || 'en';

    const existingPhone = await User.findByPhone(phone);
    if (existingPhone) {
      return res.status(409).json({ error: req.t('errors.phone_exists') });
    }

    const existingName = await User.findByFullName(first_name, last_name);
    if (existingName) {
      return res.status(409).json({ error: req.t('errors.name_exists') });
    }

    if (email) {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ error: req.t('errors.email_exists') });
      }
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    try {
      const decoded = jwt.verify(otp_token, JWT_SECRET);
      if (decoded.phone !== phone || !decoded.otp_verified) {
        return res.status(400).json({ error: 'OTP verification required' });
      }
    } catch {
      return res.status(400).json({ error: 'OTP verification required' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const unique_id = await User.generateUniqueId(phone);

    const user = await User.create({
      unique_id,
      role: 'client',
      first_name,
      last_name,
      email,
      phone,
      password_hash,
      preferred_lang: preferred_lang || lang,
    });

    let legacyLinked = false;
    let legacyDetail = null;

    const legacy = await LegacyClient.findByPhone(phone);
    if (legacy && !legacy.matched_user_id) {
      await User.linkLegacyClient(user.id, legacy.id);
      legacyLinked = true;
      legacyDetail = {
        full_name: `${legacy.first_name} ${legacy.last_name}`,
        past_membership: legacy.past_membership,
        total_spent: legacy.total_spent,
      };

      if (parseFloat(legacy.total_spent) > 0) {
        const { Transaction } = require('../models/Transaction');
        const { WellnessCoinLedger } = require('../models/WellnessCoinLedger');
        const coinAmount = Math.floor(parseFloat(legacy.total_spent) * 0.05);

        await User.update(user.id, { wellness_coin_balance: coinAmount });
        await WellnessCoinLedger.create({
          user_id: user.id,
          operation: 'earned',
          amount: coinAmount,
          running_balance: coinAmount,
          reference_type: 'legacy_loyalty',
          description: `Loyalty bonus from legacy data (${legacy.total_spent} MAD spent)`,
        });
        await Transaction.create({
          user_id: user.id,
          type: 'wellness_coin_credit',
          amount: coinAmount,
          description: 'Legacy loyalty bonus credit',
        });
      }
    }

    const prospects = await Prospect.findByPhone(phone);
    for (const p of prospects) {
      if (p.status !== 'converted') {
        await Prospect.convertToUser(p.id, user.id);
      }
    }

    await OtpCode.invalidateByPhone(phone);

    const token = generateToken({
      id: user.id, role: user.role, phone: user.phone,
    });

    res.status(201).json({
      message: legacyLinked
        ? req.t('auth.membership_activated', { unique_id: user.unique_id })
        : req.t('auth.create_account'),
      user: sanitizeUser(user),
      token,
      legacy_linked: legacyLinked,
      legacy_detail: legacyDetail,
      membership_card: {
        unique_id: user.unique_id,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: req.t('errors.server_error'), details: err.message });
  }
}

async function registerWithLegacyLink(req, res) {
  try {
    const { first_name, last_name, email, phone, password, preferred_lang, legacy_id } = req.body;
    const lang = req.language || 'en';

    const existingPhone = await User.findByPhone(phone);
    if (existingPhone) {
      return res.status(409).json({ error: req.t('errors.phone_exists') });
    }

    if (first_name && last_name) {
      const existingName = await User.findByFullName(first_name, last_name);
      if (existingName) {
        return res.status(409).json({ error: req.t('errors.name_exists') });
      }
    }

    const legacy = legacy_id
      ? await LegacyClient.findById(legacy_id)
      : await LegacyClient.findByPhone(phone);

    if (!legacy) {
      return res.status(404).json({ error: 'No legacy record found for this phone. Use standard registration.' });
    }

    if (legacy.matched_user_id) {
      return res.status(409).json({ error: 'This legacy record is already linked to an existing user.' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const unique_id = await User.generateUniqueId(phone);

    const user = await User.create({
      unique_id,
      role: 'client',
      first_name: first_name || legacy.first_name || 'Legacy',
      last_name: last_name || legacy.last_name || 'Client',
      email: email || legacy.email,
      phone,
      password_hash,
      preferred_lang: preferred_lang || lang,
    });

    await User.linkLegacyClient(user.id, legacy.id);

    const legacyTotal = parseFloat(legacy.total_spent || 0);
    if (legacyTotal > 0) {
      const { Transaction } = require('../models/Transaction');
      const { WellnessCoinLedger } = require('../models/WellnessCoinLedger');
      const coinAmount = Math.floor(legacyTotal * 0.05);

      await User.update(user.id, { wellness_coin_balance: coinAmount });
      await WellnessCoinLedger.create({
        user_id: user.id, operation: 'earned',
        amount: coinAmount, running_balance: coinAmount,
        reference_type: 'legacy_loyalty',
        description: `Loyalty bonus from legacy data (${legacyTotal} MAD spent)`,
      });
      await Transaction.create({
        user_id: user.id, type: 'wellness_coin_credit',
        amount: coinAmount, description: 'Legacy loyalty bonus credit',
      });
    }

    await OtpCode.invalidateByPhone(phone);

    const token = generateToken({ id: user.id, role: user.role, phone: user.phone });

    res.status(201).json({
      message: req.t('auth.membership_activated', { unique_id: user.unique_id }),
      user: sanitizeUser(user),
      token,
      legacy_linked: true,
      membership_card: {
        unique_id: user.unique_id,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Legacy register error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
}

const DEV_USERS = [
  { phone: '+212600000001', password: 'client123', role: 'client', first_name: 'Ahmed', last_name: 'Benali' },
  { phone: '+212600000002', password: 'admin123', role: 'admin', first_name: 'Admin', last_name: 'MedWell' },
].map(u => ({ ...u, unique_id: generateEncryptedId(u.phone) }));

async function login(req, res) {
  try {
    const { phone, password } = req.body;

    const dev = DEV_USERS.find(u => u.phone === phone && u.password === password);
    if (dev) {
      const token = generateToken({ id: `dev-${dev.role}`, role: dev.role, phone: dev.phone });
      return res.json({
        user: {
          id: `dev-${dev.role}`,
          unique_id: dev.unique_id,
          role: dev.role,
          first_name: dev.first_name,
          last_name: dev.last_name,
          phone: dev.phone,
          email: dev.role === 'admin' ? 'admin@medwell.ma' : 'ahmed@example.com',
          preferred_lang: 'en',
          wellness_coin_balance: dev.role === 'admin' ? 0 : 250,
        },
        token,
        membership_card: {
          unique_id: dev.unique_id,
          name: `${dev.first_name} ${dev.last_name}`,
          phone: dev.phone,
        },
      });
    }

    const user = await User.findByPhone(phone);
    if (!user) {
      return res.status(401).json({ error: req.t('errors.invalid_credentials') });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: req.t('errors.invalid_credentials') });
    }

    await User.update(user.id, { last_login_at: new Date() });

    const token = generateToken({ id: user.id, role: user.role, phone: user.phone });

    res.json({
      user: sanitizeUser(user),
      token,
      membership_card: {
        unique_id: user.unique_id,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function checkPhone(req, res) {
  try {
    const { phone } = req.params;
    const cleaned = phone.replace(/[^0-9+]/g, '');

    const dev = DEV_USERS.find(u => u.phone === cleaned);
    if (dev) {
      return res.json({
        phone: cleaned,
        exists: true,
        has_legacy_data: false,
        legacy_detail: null,
        has_prospect_data: false,
        prospect_detail: null,
      });
    }

    const existingUser = await User.findByPhone(cleaned);
    const legacy = await LegacyClient.findByPhone(cleaned);
    const prospects = await Prospect.findByPhone(cleaned);

    const activeProspect = prospects.find(p => p.status !== 'converted' && p.status !== 'lost') || null;

    res.json({
      phone: cleaned,
      exists: !!existingUser,
      has_legacy_data: !!legacy,
      legacy_detail: legacy ? {
        id: legacy.id,
        full_name: `${legacy.first_name} ${legacy.last_name}`,
        past_membership: legacy.past_membership,
        total_spent: legacy.total_spent,
        already_linked: !!legacy.matched_user_id,
      } : null,
      has_prospect_data: prospects.length > 0,
      prospect_detail: activeProspect ? {
        id: activeProspect.id,
        full_name: activeProspect.full_name,
        interested_service: activeProspect.interested_service,
        status: activeProspect.status,
      } : null,
    });
  } catch (err) {
    console.error('Check phone error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: req.t('errors.not_found') });

    const legacy = user.legacy_client_id
      ? await LegacyClient.findById(user.legacy_client_id)
      : null;

    const prospectMatches = await Prospect.findByPhone(user.phone);

    res.json({
      user: sanitizeUser(user),
      legacy_data: legacy ? {
        full_name: `${legacy.first_name} ${legacy.last_name}`,
        past_membership: legacy.past_membership,
        total_spent: legacy.total_spent,
        member_since: legacy.membership_start,
      } : null,
      prospect_history: prospectMatches.length,
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function refreshToken(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = generateToken({ id: user.id, role: user.role, phone: user.phone });
    res.json({ token });
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
}

async function loginRequest(req, res) {
  try {
    const { first_name, last_name, password } = req.body;
    const user = await User.findByFullName(first_name, last_name);
    if (!user) {
      return res.status(401).json({ error: req.t('errors.invalid_credentials') });
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: req.t('errors.invalid_credentials') });
    }
    const { code } = await OtpCode.create(user.phone, 'login');
    console.log(`[SIMULATION] Login OTP for ${user.phone}: ${code}`);
    res.json({
      message: 'Code de connexion généré',
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      dev_code: code,
    });
  } catch (err) {
    console.error('Login request error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function loginWithOtp(req, res) {
  try {
    const { phone, code } = req.body;
    const cleaned = phone.replace(/[^0-9+]/g, '');
    const otp = await OtpCode.verify(cleaned, code, 'login');
    if (!otp) {
      return res.status(400).json({ error: req.t('errors.invalid_otp') });
    }
    const user = await User.findByPhone(cleaned);
    if (!user) {
      return res.status(401).json({ error: req.t('errors.invalid_credentials') });
    }
    await User.update(user.id, { last_login_at: new Date() });
    await OtpCode.invalidateByPhone(cleaned);
    const token = generateToken({ id: user.id, role: user.role, phone: user.phone });
    res.json({
      user: sanitizeUser(user),
      token,
      membership_card: {
        unique_id: user.unique_id,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login with OTP error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

function sanitizeUser(user) {
  const { password_hash, ...rest } = user;
  return rest;
}

module.exports = {
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
};

async function forgotPassword(req, res) {
  try {
    const { phone } = req.body;
    const cleaned = phone.replace(/[^0-9+]/g, '');
    const user = await User.findByPhone(cleaned);
    if (!user) return res.status(404).json({ error: req.t('errors.not_found') });

    const { code } = await OtpCode.create(cleaned, 'password_reset');
    console.log(`[PASSWORD RESET] OTP for ${cleaned}: ${code}`);

    res.json({ message: req.t('auth.otp_sent'), phone: cleaned, dev_code: code });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function resetPassword(req, res) {
  try {
    const { phone, code, new_password } = req.body;
    const cleaned = phone.replace(/[^0-9+]/g, '');

    const otp = await OtpCode.verify(cleaned, code, 'password_reset');
    if (!otp) return res.status(400).json({ error: req.t('auth.invalid_otp') });

    const hashed = await bcrypt.hash(new_password, SALT_ROUNDS);
    await User.update(otp.user_id, { password_hash: hashed });

    await OtpCode.invalidateByPhone(cleaned);
    await User.findById(otp.user_id);
    const updateQuery = require('../config/database').query;
    await updateQuery('UPDATE users SET password_hash = ?, updated_at = NOW() WHERE phone = ?', [hashed, cleaned]);

    res.json({ message: req.t('auth.password_reset_success') });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}
