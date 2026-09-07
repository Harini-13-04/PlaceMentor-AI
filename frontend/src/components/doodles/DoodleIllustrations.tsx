import React from "react";
import heroLightImg from "../../assets/hero-light.png";
import heroDarkImg from "../../assets/hero-dark.png";
import loginDarkImg from "../../assets/login-dark.png";
import loginLightImg from "../../assets/login-light.png";
import registerLightImg from "../../assets/register-light.png";
import registerDarkImg from "../../assets/register-dark.png";

/**
 * Landing Hero Illustration
 * Student sitting at laptop, coffee mug, book stack (Learn, Practice, Grow, Get Placed),
 * thought bubble ("Better Skills Brighter Future ♡"), handwritten "A Brighter You".
 */
export const HeroDoodleIllustration: React.FC<{ className?: string }> = ({ className = "w-full max-w-lg" }) => {
  return (
    <div className={`relative flex items-center justify-center p-2 select-none ${className}`}>
      {/* Soft Ambient Background Glow */}
      <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl -z-10 transform scale-90" />

      {/* Light Theme Exact Reference Image */}
      <img
        src={heroLightImg}
        alt="PlaceMentor AI Hero Illustration"
        className="w-full h-auto rounded-2xl object-contain dark:hidden transition-all duration-300 drop-shadow-md border border-slate-200/80"
      />

      {/* Dark Theme Exact Reference Image */}
      <img
        src={heroDarkImg}
        alt="PlaceMentor AI Hero Illustration Dark"
        className="w-full h-auto rounded-2xl object-contain hidden dark:block transition-all duration-300 drop-shadow-md border border-slate-800/80"
      />
    </div>
  );
};

/**
 * Login Page Illustration
 * Cute student studying at laptop with book stack (Learn, Practice, Improve, Get Placed), pen cup, thought bubble, handwritten "Progress looks good on you ♡".
 */
export const LoginDoodleIllustration: React.FC<{ className?: string }> = ({ className = "w-full max-w-lg" }) => {
  return (
    <div className={`relative flex items-center justify-center p-2 select-none ${className}`}>
      {/* Soft Ambient Background Glow */}
      <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl -z-10 transform scale-90" />

      {/* Light Theme Image */}
      <img
        src={loginLightImg}
        alt="PlaceMentor AI Login Illustration Light"
        className="w-full h-auto rounded-2xl object-contain dark:hidden transition-all duration-300 drop-shadow-xl border border-slate-200/80"
      />

      {/* Dark Theme Image */}
      <img
        src={loginDarkImg}
        alt="PlaceMentor AI Login Illustration Dark"
        className="w-full h-auto rounded-2xl object-contain hidden dark:block transition-all duration-300 drop-shadow-xl border border-slate-800/50"
      />
    </div>
  );
};

/**
 * Register Page Illustration
 * Male and female student studying together at laptop with colored books, sticky notes, mug, notebook, and handwritten "More Learning Brighter Futures ♡".
 */
export const RegisterDoodleIllustration: React.FC<{ className?: string }> = ({ className = "w-full max-w-lg" }) => {
  return (
    <div className={`relative flex items-center justify-center p-2 select-none ${className}`}>
      {/* Soft Ambient Background Glow */}
      <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl -z-10 transform scale-90" />

      {/* Light Theme Image */}
      <img
        src={registerLightImg}
        alt="PlaceMentor AI Register Illustration Light"
        className="w-full h-auto rounded-2xl object-contain dark:hidden transition-all duration-300 drop-shadow-xl border border-slate-200/80"
      />

      {/* Dark Theme Image */}
      <img
        src={registerDarkImg}
        alt="PlaceMentor AI Register Illustration Dark"
        className="w-full h-auto rounded-2xl object-contain hidden dark:block transition-all duration-300 drop-shadow-xl border border-slate-800/50"
      />
    </div>
  );
};
