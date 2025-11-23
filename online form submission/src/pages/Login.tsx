import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";



// Background image
const loginBg = new URL('../assets/login-bg.jpg', import.meta.url).href;

// API base URL
const BASE_API_URL = "http://localhost:8000/api/auth";

type AuthView = "login" | "signup" | "forgotPassword" | "resetPassword";

const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("login");

  const [searchParams] = useSearchParams();
  // --- Form states ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // --- UI states ---
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "true") {
      toast.success("Email verified successfully! You can now log in.");
    }
  }, [location]);

  useEffect(() => {
    // load remembered email if present
    try {
      const saved = localStorage.getItem("rememberEmail");
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch (e) {
      // ignore (e.g., during SSR)
    }
  }, []);

  // Inject gradient CSS for animated background on the client only
  useEffect(() => {
    const css = `
      .animate-gradient {
        width: 100%;
        height: 100%;
        background: linear-gradient(270deg, #7c3aed, #06b6d4, #60a5fa, #f97316);
        background-size: 800% 800%;
        animation: gradientShift 18s ease infinite;
        opacity: 0.15;
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-from', 'LoginComponent');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Strong password regex
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?]).{8,}$/;

  // --- API request helper ---
  const handleApiRequest = async (endpoint: string, body: object) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "An error occurred");
      return data;
    } catch (err: any) {
      toast.error(err.message, { id: "api-error" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  // Resend verification email
  const handleResendVerification = async () => {
    if (!email) return toast.error("Email is required");
    const res = await handleApiRequest("/send-otp", { email });
    if (res && res.success) {
      toast.success(`Verification email sent to ${email}`);
    }
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await handleApiRequest("/login", { email, password });
    if (res) {
      if (res.token && res.data) {
        const username = res.data.username?.trim() || res.data.email?.split("@")[0] || "User";
        toast.success(`Welcome back, ${username}! 🎉`, { id: "login-success" });
        localStorage.setItem("authToken", res.token);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        try {
          if (rememberMe) {
            localStorage.setItem("rememberEmail", email);
          } else {
            localStorage.removeItem("rememberEmail");
          }
        } catch (e) {
          // ignore storage errors
        }
        navigate("/dashboard");
      } else if (res.message === "Please verify your email first") {
        toast.error("Please verify your email first", {
          id: "email-not-verified",
          action: {
            label: "Resend Email",
            onClick: handleResendVerification,
          },
          duration: 8000,
        });
      }
    }
  };

  // Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!strongPasswordRegex.test(signupPassword)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        { id: "signup-password-error" }
      );
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error("Passwords do not match!", { id: "signup-confirm-password" });
      return;
    }

    const res = await handleApiRequest("/register", {
      username,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
    });

    if (res && res.success) {
      toast.success("Registration successful! Please check your email to verify.", { id: "signup-success" });
      setView("login");
      setEmail(signupEmail);
    }
  };

  // Forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await handleApiRequest("/forgot-password", { email: forgotEmail });
    if (res && res.success) {
      toast.success(`OTP sent to ${forgotEmail}`, { id: "forgot-password" });
      setView("resetPassword");
    }
  };

  // Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!strongPasswordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        { id: "reset-password-error" }
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match!", { id: "reset-confirm-password" });
      return;
    }

    const res = await handleApiRequest("/reset-password", {
      email: forgotEmail,
      otp,
      newPassword,
      confirmPassword: confirmNewPassword,
    });

    if (res && res.success) {
      toast.success(`Password updated for ${forgotEmail}`, { id: "reset-password" });
      setView("login");
      setEmail(forgotEmail);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full animate-gradient" />
      </div>

      <div className="w-full max-w-4xl mx-auto px-2">
        <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* LEFT: Form area */}
          <div className="w-full md:w-1/2 p-8 lg:p-12">
            <div className="max-w-sm">
              <div className="mb-6">
                <h1 className="text-4xl font-extrabold text-foreground mb-2">Application Portal</h1>
                <p className="text-muted-foreground">Your gateway to academic and career opportunities.</p>
              </div>

              <div className="bg-card rounded-2xl shadow-sm p-6">
                {(view === "login" || view === "signup") && (
                  <Tabs defaultValue={view} onValueChange={(v) => setView(v as AuthView)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="signup" disabled={loading}>Signup</TabsTrigger>
                      <TabsTrigger value="login" disabled={loading}>Login</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={loading}
                              required
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                            >
                              {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remember"
                              checked={rememberMe}
                              onCheckedChange={(v) => setRememberMe(Boolean(v))}
                              disabled={loading}
                            />
                            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember Me</label>
                          </div>
                          <Button type="button" variant="link" onClick={() => setView("forgotPassword")} disabled={loading}>
                            Forgot Password?
                          </Button>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Loading..." : "Login"}</Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup">
                      <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="signup-username">Username</Label>
                          <Input id="signup-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input id="signup-email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} disabled={loading} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Label className="text-sm text-muted-foreground block pb-3">At least 8 characters, mix of upper/lowercase, number & special char.</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showSignupPassword ? "text" : "password"}
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              disabled={loading}
                              required
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                              tabIndex={-1}
                            >
                              {showSignupPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              id="signup-confirm-password"
                              type={showSignupConfirmPassword ? "text" : "password"}
                              value={signupConfirmPassword}
                              onChange={(e) => setSignupConfirmPassword(e.target.value)}
                              disabled={loading}
                              required
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                              tabIndex={-1}
                            >
                              {showSignupConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                            </button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Loading..." : "Create Account"}</Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                )}

                {view === "forgotPassword" && (
                  <div className="space-y-5">
                    <h3 className="font-semibold">Forgot Password</h3>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} disabled={loading} required />
                      <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
                      <Button type="button" variant="link" className="w-full" onClick={() => setView("login")} disabled={loading}>Back to Login</Button>
                    </form>
                  </div>
                )}

                {view === "resetPassword" && (
                  <div className="space-y-5">
                    <h3 className="font-semibold">Reset Password</h3>
                    <p className="text-sm text-muted-foreground">OTP sent to <strong>{forgotEmail}</strong></p>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <Label>Enter 6-Digit OTP</Label>
                      <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                        <InputOTPGroup className="w-full">
                          <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            tabIndex={-1}
                          >
                            {showNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-new-password">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirm-new-password"
                            type={showConfirmNewPassword ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            disabled={loading}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            tabIndex={-1}
                          >
                            {showConfirmNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
                      <Button type="button" variant="link" className="w-full" onClick={() => setView("login")} disabled={loading}>Back to Login</Button>
                    </form>
                  </div>
                )}
              </div>

              <footer className="mt-6 text-xs text-muted-foreground">© 2025 Online Form Submission Guide</footer>
            </div>
          </div>

          {/* RIGHT: Image/marketing area */}
          <div className="hidden md:block md:w-1/2 relative">
            <img
              src={loginBg}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"/>

            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700/60 to-sky-400/30 backdrop-blur-sm flex flex-col justify-center items-start p-12 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="max-w-xs text-sm opacity-95">
                  Access your application dashboard, manage documents, and track submissions with ease.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

}

export default Login;
