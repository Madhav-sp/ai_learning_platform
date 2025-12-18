"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 1000); // 1 second

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-5 animate-fade-in">
        {/* Logo */}
        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
          <Zap className="w-6 h-6 text-black" />
        </div>

        {/* Text */}
        <p className="text-sm text-neutral-400 tracking-wide">
          TutorX is preparing something amazing
        </p>

        {/* Loader bar */}
        <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-full bg-orange-500 animate-loading-bar" />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-loading-bar {
          animation: loading-bar 1s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
