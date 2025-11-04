"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function WelcomeSection() {
  const { user } = useAuth();

  if (!user) return null;

  const firstName = user.firstName + " " + user.lastName
  const currentHour = new Date().getHours();

  let greeting = "Buenas noches";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Buenos días";
  } else if (currentHour >= 12 && currentHour < 19) {
    greeting = "Buenas tardes";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold text-foreground">
          {greeting}, {firstName}!
        </h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Bienvenido a Terra Prime. Selecciona un módulo para comenzar.
      </p>
    </motion.div>
  );
}
