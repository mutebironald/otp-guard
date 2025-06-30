const { authenticator } = require('otplib');

const users = new Map();

const TIME_TO_EXPIRE = parseInt(process.env.TIME_TO_EXPIRE || '120', 10);
authenticator.options = { step: TIME_TO_EXPIRE }

function generateUserSecret(email){
  const secret = authenticator.generateSecret();
  users.set(email, { secret });
  return secret;
}

function sendOtpToUser(email) {
  const user = users.get(email);
  if (!user) throw new Error('User not registered.');

  const token = authenticator.generate(user.secret);
  console.log(`[OTP SENT] To: ${email} | OTP: ${token}`); // Simulate sending
  user.lastOtp = token;
  user.otpSentAt = new Date();
}

function validateOtp(email, inputOtp) {
  const user = users.get(email);
  if (!user) throw new Error('User not registered.');

  console.log(inputOtp, user.secret)
  const isValid = authenticator.check(inputOtp, user.secret);
  if (!isValid) throw new Error('Invalid or expired OTP');

  console.log('✅ OTP is valid. Access granted.');
  return true;
}


const generateOTP = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  if (!users.has(email)) generateUserSecret(email);

  try {
    sendOtpToUser(email);
    res.json({ message: `OTP sent to ${email}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  try {
    validateOtp(email, otp);
    res.json({ message: 'OTP valid, access granted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


module.exports = { generateOTP, verifyOTP }
