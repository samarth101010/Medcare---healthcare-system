import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: 'primary' | 'accent' | 'success' | 'warning';
}

const variantStyles = {
  primary: 'gradient-primary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
};

const StatCard = ({ title, value, change, icon: Icon, variant = 'primary' }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border bg-card p-6 card-shadow hover:shadow-elevated transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold font-heading text-card-foreground">{value}</p>
          {change !== undefined && (
            <p className={`mt-1 text-sm font-medium ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`${variantStyles[variant]} flex h-11 w-11 items-center justify-center rounded-xl`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
