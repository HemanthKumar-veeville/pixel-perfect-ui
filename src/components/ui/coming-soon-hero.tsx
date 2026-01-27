import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ComingSoonHeroProps extends React.HTMLAttributes<HTMLDivElement> {}

const ComingSoonHero = React.forwardRef<HTMLDivElement, ComingSoonHeroProps>(
  ({ className, ...props }, ref) => {
    // Set target date (3 days, 5 hours, 35 minutes from now)
    const [targetDate] = useState(() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      date.setHours(date.getHours() + 5);
      date.setMinutes(date.getMinutes() + 35);
      return date;
    });

    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const target = targetDate.getTime();
        const difference = target - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      calculateTimeLeft();
      const interval = setInterval(calculateTimeLeft, 1000); // Update every second

      return () => clearInterval(interval);
    }, [targetDate]);

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen bg-background",
          className
        )}
        role="status"
        aria-label="Coming soon feature"
        {...props}
      >
        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-2xl mx-auto">
            {/* Content */}
            <div className="space-y-6 sm:space-y-8">
              {/* Headline */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="gradient-text">Coming Soon</span>
                </h1>
              </div>

              {/* Countdown Timer */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] border-2 border-primary rounded-lg p-4 sm:p-5 bg-card shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 font-mono tabular-nums">
                      {String(timeLeft.days).padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      Days
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] border-2 border-primary rounded-lg p-4 sm:p-5 bg-card shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 font-mono tabular-nums">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      Hours
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] border-2 border-primary rounded-lg p-4 sm:p-5 bg-card shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 font-mono tabular-nums">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      Minutes
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] border-2 border-primary rounded-lg p-4 sm:p-5 bg-card shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 font-mono tabular-nums">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      Seconds
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }
);

ComingSoonHero.displayName = "ComingSoonHero";

export { ComingSoonHero };
