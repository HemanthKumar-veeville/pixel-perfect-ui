import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, isAuthenticated } = useAuth();
  const [showError, setShowError] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
    navigate(from, { replace: true });
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setShowError(false);
    try {
      const result = await login(data);
      if (result.type === "auth/login/fulfilled") {
        // Redirect to the page user was trying to access, or home
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setShowError(true);
      }
    } catch (err) {
      setShowError(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/NUSENSE_LOGO.svg" 
            alt="Nusense Logo" 
            className="h-12 w-auto transition-opacity hover:opacity-80"
          />
        </div>

        {/* Card */}
        <Card className="border-sidebar-border shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to continue to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {showError && error && (
              <Alert variant="destructive" className="border-destructive/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {error.message || "Invalid email or password. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-11 pl-10 pr-4 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={loading}
                    tabIndex={0}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-sm font-medium text-destructive"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-sm"
                    tabIndex={0}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-11 pl-10 pr-4 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-sm font-medium text-destructive"
                    role="alert"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
                aria-label="Sign in to your account"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-0 pt-6">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-sm"
                tabIndex={0}
              >
                Create one
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
