import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Loader2, Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { forgotPassword, loading, error } = useAuth();
  const [showError, setShowError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setShowError(false);
    setIsSuccess(false);
    try {
      const result = await forgotPassword(data);
      if (result.type === "auth/forgotPassword/fulfilled") {
        setIsSuccess(true);
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
              Forgot Password
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Enter your email address and we'll send you a password reset link
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {isSuccess ? (
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
                  If an account with that email exists, we've sent a password reset link.
                  Please check your email inbox.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {showError && error && (
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">
                      {error.message || "Failed to send password reset email. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}

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

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={loading}
                  aria-label="Send password reset email"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
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

export default ForgotPassword;
