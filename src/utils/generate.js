import otpGenerator from "otp-generator"

// generate slug
const generateSlug = (title) => {
  return title.trim().toLowerCase().replace(' ', '-')
}


// Generate OTP 
const generateUniqueCode = (length = 16) => {
    const otp = otpGenerator.generate(length, {lowerCaseAlphabets:false, upperCaseAlphabets: false,  specialChars: false }); 
    return otp;
}
export  {generateSlug, generateUniqueCode}
