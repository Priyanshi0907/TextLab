import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  FileText,
  Smile,
  ShieldAlert,
  MessageSquare,
  Heart,
  AlertCircle,
} from "lucide-react";
import api from "../lib/api";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [tab, setTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleTabChange(nextTab) {
    setTab(nextTab);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let user;
      if (tab === "login") {
        user = await api.login(formData.email, formData.password);
      } else {
        user = await api.signup(formData.name, formData.email, formData.password);
      }
      localStorage.setItem("textlab_user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  function handleSocialLogin(provider) {
    const user = {
      id: 1,
      name: "Priyanshi",
      email: "priyanshi@example.com",
    };
    localStorage.setItem("textlab_user", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }

  return (
    <div className="h-screen w-screen bg-[#0e100a] flex items-center justify-center p-3 sm:p-5 overflow-hidden font-sans antialiased selection:bg-[#5f684c] selection:text-white">
      {/* ========================================================================= */}
      {/* MAIN CENTERED BOX                                                         */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1080px] h-[700px] max-h-[96vh] bg-[#141610] rounded-[28px] border border-[#272d1f] shadow-2xl shadow-black/90 flex overflow-hidden">
        
        {/* ======================================================================= */}
        {/* LEFT PANEL: Clean Warm Linen Studio Canvas with Feature Timeline        */}
        {/* ======================================================================= */}
        <div className="relative w-1/2 h-full bg-[#E8E4D9] text-[#1c2017] p-8 lg:px-9 lg:py-8 flex flex-col justify-start overflow-hidden shrink-0">
          
          {/* Top-Left Subtle Dot Grid Pattern */}
          <div className="absolute top-6 left-6 grid grid-cols-4 gap-2.5 opacity-35 pointer-events-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7a806c]" />
            ))}
          </div>

          {/* Bottom-Right Concentric Circular Lines */}
          <svg
            className="absolute -bottom-10 -right-10 w-72 h-72 opacity-25 pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="200" cy="200" r="50" stroke="#77806a" strokeWidth="1" />
            <circle cx="200" cy="200" r="80" stroke="#77806a" strokeWidth="1" />
            <circle cx="200" cy="200" r="110" stroke="#77806a" strokeWidth="1" />
            <circle cx="200" cy="200" r="140" stroke="#77806a" strokeWidth="1" />
            <circle cx="200" cy="200" r="170" stroke="#77806a" strokeWidth="1" />
          </svg>

          {/* Top Brand Header */}
          <div className="relative z-10 mb-3.5">
            <Link to="/" className="flex items-center gap-3.5 cursor-pointer group inline-flex">
              <div className="w-13 h-13 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 54 54" fill="none" className="w-12 h-12">
                  <path
                    d="M27 6C15.402 6 6 14.954 6 26c0 4.148 1.332 7.994 3.626 11.206L6.5 48l11.594-3.092A21.576 21.576 0 0027 46c11.598 0 21-8.954 21-20S38.598 6 27 6z"
                    stroke="#1c2017"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M27 36V21" stroke="#4d583b" strokeWidth="2.4" strokeLinecap="round" />
                  <path d="M27 21c-2.2-3.6-.9-8 1.8-9 2.7 1 4 5.4 1.8 9z" fill="#5c6a46" />
                  <path d="M27 26.5c-4-1-7.5-4-7-7 3 .4 6 3.6 7 7z" fill="#5c6a46" />
                  <path d="M27 30c4-1 7.5-4 7-7-3 .4-6 3.6-7 7z" fill="#5c6a46" />
                </svg>
              </div>
              <div>
                <h1 className="text-[25px] font-black tracking-[0.15em] text-[#1c2017] uppercase leading-none">
                  TEXTLAB
                </h1>
                <p className="text-[12.5px] text-[#5e6650] font-medium tracking-wide mt-1 leading-tight">
                  Text Processing &<br />
                  Classification Studio
                </p>
              </div>
            </Link>
          </div>

          {/* Accent Bars */}
          <div className="relative z-10 flex gap-2.5 mb-3.5">
            <div className="w-8 h-1 bg-[#5b6647] rounded-full"></div>
            <div className="w-8 h-1 bg-[#8c947a] rounded-full"></div>
          </div>

          {/* Hero Typography */}
          <div className="relative z-10 mb-4">
            <h2 className="text-[24px] font-bold text-[#1c2017] leading-[1.25] tracking-tight">
              Understand text.
              <br />
              Extract meaning. Drive insights.
            </h2>
            <p className="text-[13.5px] text-[#5a624d] mt-2 leading-snug max-w-[430px]">
              Advanced NLP models to classify and analyze text data with accuracy and efficiency.
            </p>
          </div>

          {/* Section Divider */}
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <span className="text-[11.5px] font-bold tracking-[0.14em] text-[#525a45] uppercase">
              WHAT TEXTLAB CAN DO
            </span>
            <div className="flex-1 h-[1px] bg-[#beb7a5]"></div>
          </div>

          {/* 5 Feature Items with Connected Timeline */}
          <div className="relative z-10 pl-0.5 space-y-4">
            {/* Continuous Vertical Timeline Line behind icons */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[1.5px] bg-[#c3bcab] -z-0"></div>

            {/* 1. Topic Classification */}
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#dad4c5] border border-[#c4bda9] flex items-center justify-center flex-shrink-0 text-[#3b432e] shadow-sm">
                <FileText size={17} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-[14px] font-bold text-[#1c2017] leading-none">
                  Topic Classification
                </h3>
                <p className="text-[12px] text-[#5c6450] leading-snug mt-1">
                  Categorize text into predefined topics like Technology, Sports, Business and more.
                </p>
              </div>
            </div>

            {/* 2. Sentiment Classification */}
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#dad4c5] border border-[#c4bda9] flex items-center justify-center flex-shrink-0 text-[#3b432e] shadow-sm">
                <Smile size={17} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-[14px] font-bold text-[#1c2017] leading-none">
                  Sentiment Classification
                </h3>
                <p className="text-[12px] text-[#5c6450] leading-snug mt-1">
                  Detect whether the sentiment is Positive, Negative or Neutral.
                </p>
              </div>
            </div>

            {/* 3. Spam Detection */}
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#dad4c5] border border-[#c4bda9] flex items-center justify-center flex-shrink-0 text-[#3b432e] shadow-sm">
                <ShieldAlert size={17} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-[14px] font-bold text-[#1c2017] leading-none">
                  Spam Detection
                </h3>
                <p className="text-[12px] text-[#5c6450] leading-snug mt-1">
                  Identify spam or unwanted messages with high accuracy.
                </p>
              </div>
            </div>

            {/* 4. Intent Classification */}
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#dad4c5] border border-[#c4bda9] flex items-center justify-center flex-shrink-0 text-[#3b432e] shadow-sm">
                <MessageSquare size={17} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-[14px] font-bold text-[#1c2017] leading-none">
                  Intent Classification
                </h3>
                <p className="text-[12px] text-[#5c6450] leading-snug mt-1">
                  Understand the purpose behind a text such as Question, Request or Feedback.
                </p>
              </div>
            </div>

            {/* 5. Emotion Classification */}
            <div className="relative z-10 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#dad4c5] border border-[#c4bda9] flex items-center justify-center flex-shrink-0 text-[#3b432e] shadow-sm">
                <Heart size={17} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-[14px] font-bold text-[#1c2017] leading-none">
                  Emotion Classification
                </h3>
                <p className="text-[12px] text-[#5c6450] leading-snug mt-1">
                  Detect emotions like Happy, Sad, Angry, Fear, Surprise and more.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Wave Decorative Footer */}
          <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-0">
            <svg viewBox="0 0 600 85" preserveAspectRatio="none" className="w-full h-16">
              <path d="M0,32 C150,68 320,8 600,48 L600,85 L0,85 Z" fill="#525d43" opacity="0.9" />
              <path d="M0,54 C200,22 400,78 600,42 L600,85 L0,85 Z" fill="#3a422e" />
            </svg>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT PANEL: Deep Matte Dark Area with Clean Auth Card                  */}
        {/* ======================================================================= */}
        <div className="relative w-1/2 h-full bg-[#141610] p-7 lg:p-9 flex items-center justify-center shrink-0">
          
          {/* Subtle Right-Side Leaf Silhouette */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-44 h-88 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 200" fill="none" className="w-full h-full stroke-[#8a9870]">
              <path d="M90,20 Q60,60 95,100 T90,180" strokeWidth="2" strokeLinecap="round" />
              <path d="M75,45 Q50,40 55,25 Q70,30 75,45 Z" fill="#8a9870" />
              <path d="M85,75 Q60,70 65,55 Q80,60 85,75 Z" fill="#8a9870" />
              <path d="M95,115 Q70,110 75,95 Q90,100 95,115 Z" fill="#8a9870" />
              <path d="M88,150 Q63,145 68,130 Q83,135 88,150 Z" fill="#8a9870" />
            </svg>
          </div>

          {/* Inner Card Container */}
          <div className="relative z-10 w-full max-w-[400px] bg-[#1a1d15] border border-[#2b3023] rounded-[26px] shadow-xl p-7 sm:p-8">
            
            {/* Top Tabs */}
            <div className="flex items-center justify-center border-b border-[#282d20] pb-2.5 mb-4">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={`relative px-8 py-1.5 text-[15px] font-semibold transition-colors cursor-pointer ${
                  tab === "login" ? "text-[#f0ece1]" : "text-[#7c8370] hover:text-[#c4ccb8]"
                }`}
              >
                Login
                {tab === "login" && (
                  <div className="absolute bottom-[-11px] left-0 right-0 h-[2.5px] bg-[#75845c] rounded-full"></div>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("signup")}
                className={`relative px-8 py-1.5 text-[15px] font-semibold transition-colors cursor-pointer ${
                  tab === "signup" ? "text-[#f0ece1]" : "text-[#7c8370] hover:text-[#c4ccb8]"
                }`}
              >
                Sign Up
                {tab === "signup" && (
                  <div className="absolute bottom-[-11px] left-0 right-0 h-[2.5px] bg-[#75845c] rounded-full"></div>
                )}
              </button>
            </div>

            {/* Centered Leaf Badge Icon */}
            <div className="flex justify-center mb-2.5">
              <div className="w-12 h-12 rounded-full bg-[#23281c] border border-[#353d2b] flex items-center justify-center shadow-inner p-2.5">
                <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
                  <path
                    d="M20 5C11.716 5 5 11.268 5 19c0 2.903.932 5.596 2.538 7.844L5.5 34.5l8.116-2.164A15.103 15.103 0 0020 33c8.284 0 15-6.268 15-14S28.284 5 20 5z"
                    stroke="#98a87c"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M20 26V15" stroke="#98a87c" strokeWidth="2" strokeLinecap="round" />
                  <path d="M20 15c-1.8-2.8-.7-6 1.4-6.8 2 .8 3 4.2 1.4 6.8z" fill="#98a87c" />
                  <path d="M20 19c-3-.8-5.5-3-5-5.2 2.2.3 4.5 2.7 5 5.2z" fill="#98a87c" />
                  <path d="M20 21.5c3-.8 5.5-3 5-5.2-2.2.3-4.5 2.7-5 5.2z" fill="#98a87c" />
                </svg>
              </div>
            </div>

            {/* Header text */}
            <div className="text-center mb-4">
              <h2 className="text-[21px] font-bold text-[#f0ece1] tracking-tight leading-tight">
                {tab === "login" ? "Welcome back!" : "Create your account"}
              </h2>
              <p className="text-[12.5px] text-[#868f7a] mt-1 leading-none">
                {tab === "login"
                  ? "Login to continue to your workspace."
                  : "Sign up to get started with TextLab."}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-[#2e1818] border border-[#592626] text-[#ff8f8f] text-[12.5px] flex items-center gap-2 animate-in fade-in duration-150">
                <AlertCircle size={15} className="shrink-0" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === "signup" && (
                <div>
                  <label className="block text-[12.5px] font-medium text-[#adb69f] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7760]"
                    />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full bg-[#13150f] border border-[#2d3324] rounded-xl pl-10 pr-3 py-2.5 text-[14px] text-[#f0ece1] outline-none focus:border-[#74835a] transition-colors placeholder:text-[#555d49]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[12.5px] font-medium text-[#adb69f] mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7760]"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-[#13150f] border border-[#2d3324] rounded-xl pl-10 pr-3 py-2.5 text-[14px] text-[#f0ece1] outline-none focus:border-[#74835a] transition-colors placeholder:text-[#555d49]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-[#adb69f] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7760]"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full bg-[#13150f] border border-[#2d3324] rounded-xl pl-10 pr-10 py-2.5 text-[14px] text-[#f0ece1] outline-none focus:border-[#74835a] transition-colors placeholder:text-[#555d49]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6e7760] hover:text-[#a8b497] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {tab === "login" && (
                <div className="flex justify-end">
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions sent to your email.");
                    }}
                    className="text-[12px] text-[#8ea072] hover:text-[#a9be87] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 bg-[#5e694c] hover:bg-[#6c7957] active:bg-[#535d43] text-[#f4f1e8] font-semibold text-[14.5px] rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                <span>{loading ? "Please wait..." : tab === "login" ? "Login" : "Create Account"}</span>
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Social Divider */}
            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-[1px] bg-[#292f21]"></div>
              <span className="text-[12px] text-[#6d7561] font-normal">or continue with</span>
              <div className="flex-1 h-[1px] bg-[#292f21]"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2.5 py-2 px-3 rounded-xl border border-[#2b3123] bg-[#141610] hover:bg-[#1f2319] hover:border-[#3d4531] text-[13.5px] text-[#d6ded0] font-medium transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-2.5 py-2 px-3 rounded-xl border border-[#2b3123] bg-[#141610] hover:bg-[#1f2319] hover:border-[#3d4531] text-[13.5px] text-[#d6ded0] font-medium transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Footer Switcher */}
            <div className="text-center mt-3 text-[13px] text-[#7a836e]">
              {tab === "login" ? (
                <span>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("signup")}
                    className="text-[#9cb07d] hover:text-[#b8cfa9] font-medium transition-colors cursor-pointer"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("login")}
                    className="text-[#9cb07d] hover:text-[#b8cfa9] font-medium transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
