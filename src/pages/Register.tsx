import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must not exceed 128 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, isAuthenticated } = useAuth();
  const [showError, setShowError] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setShowError(false);
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "admin",
      });
      if (result.type === "auth/register/fulfilled") {
        // Redirect to home after successful registration
        navigate("/", { replace: true });
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
              Create Account
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Get started by creating your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {showError && error && (
              <Alert variant="destructive" className="border-destructive/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {error.message || "Registration failed. Please try again."}
                  {error.errors && (
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      {Object.entries(error.errors).map(([field, message]) => (
                        <li key={field} className="text-sm">{message}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="h-11 pl-10 pr-4 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...register("name")}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                </div>
                {errors.name && (
                  <p
                    id="name-error"
                    className="text-sm font-medium text-destructive"
                    role="alert"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11 pl-10 pr-4 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
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
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
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

              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="h-11 pl-10 pr-4 text-base transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    {...register("confirmPassword")}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                  />
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-sm font-medium text-destructive"
                    role="alert"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
                aria-label="Create your account"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-0 pt-6">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-sm"
                tabIndex={0}
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
