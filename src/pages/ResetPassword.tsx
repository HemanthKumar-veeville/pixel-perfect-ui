import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
import { Loader2, Lock, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must not exceed 128 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading, error } = useAuth();
  const [showError, setShowError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setShowError(true);
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsSuccess(false);
    try {
      const result = await resetPassword({
        token,
        newPassword: data.password,
      });
      if (result.type === "auth/resetPassword/fulfilled") {
        setIsSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
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

  if (!token && !showError) {
    return null; // Still loading token
  }

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
              Reset Password
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Enter your new password below
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {isSuccess ? (
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
                  Your password has been reset successfully. Redirecting to login...
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {showError && error && (
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">
                      {error.message || "Failed to reset password. Please try again."}
                      {error.error === "INVALID_TOKEN" && (
                        <div className="mt-2 text-sm">
                          The reset token is invalid or expired. Please request a new one.
                        </div>
                      )}
                      {error.error === "TOKEN_EXPIRED" && (
                        <div className="mt-2 text-sm">
                          The reset token has expired. Please request a new password reset.
                        </div>
                      )}
                      {error.error === "TOKEN_USED" && (
                        <div className="mt-2 text-sm">
                          This reset token has already been used. Please request a new one.
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {!token && (
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">
                      Invalid or missing reset token. Please check your email link or request a new password reset.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                    New Password
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
                      disabled={loading || !token}
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
                    Confirm New Password
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
                      disabled={loading || !token}
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
                  disabled={loading || !token}
                  aria-label="Reset your password"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-0 pt-6">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-sm"
              tabIndex={0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
