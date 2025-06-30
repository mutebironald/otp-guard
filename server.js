require('dotenv').config();
const app =require('./app')

const  PORT  = parseInt(process.env.PORT || '3000', 10) ;
app.listen(PORT, () => {
  console.log(`OTP Guard server running on http://localhost:${PORT}`);
});
