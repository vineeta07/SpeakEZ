import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricCardProps {
    title: string;
    value: number | string;
    unit?: string;
    icon: LucideIcon;
    target?: { min?: number; max?: number };
    type?: 'percentage' | 'number' | 'text';
    color?: string;
}

export const MetricCard = ({
    title,
    value,
    unit = '',
    icon: Icon,
    target,
    type = 'percentage',
    color = '#10b981',
}: MetricCardProps) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    // Generate particles on value change
    useEffect(() => {
        if (typeof value === 'number' && typeof displayValue === 'number') {
            if (value > displayValue) {
                // Positive change - rising particles
                const newParticles = Array.from({ length: 3 }, (_, i) => ({
                    id: Date.now() + i,
                    x: Math.random() * 100,
                    y: 100,
                }));
                setParticles((prev) => [...prev, ...newParticles]);
            }
        }
    }, [value, displayValue]);

    // Clean up old particles
    useEffect(() => {
        const timer = setInterval(() => {
            setParticles((prev) => prev.filter((p) => Date.now() - p.id < 2000));
        }, 100);
        return () => clearInterval(timer);
    }, []);

    const getStatusColor = () => {
        if (type === 'text') return color;
        const numValue = typeof value === 'number' ? value : 0;

        if (target) {
            if (target.min !== undefined && numValue < target.min) return '#ef4444';
            if (target.max !== undefined && numValue > target.max) return '#ef4444';
            return '#10b981';
        }

        if (numValue >= 80) return '#10b981';
        if (numValue >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const statusColor = getStatusColor();
    const numValue = typeof value === 'number' ? value : 0;
    const percentage = type === 'percentage' ? numValue : (numValue / 100) * 100;

    return (
        <motion.div
            className="relative glass rounded-xl p-4 overflow-hidden group hover:scale-105 transition-transform duration-300"
            whileHover={{ y: -5 }}
            style={{
                borderColor: `${statusColor}40`,
            }}
        >
            {/* Background gradient */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: `linear-gradient(135deg, ${statusColor}20, transparent)`,
                }}
            />

            {/* Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        background: statusColor,
                        boxShadow: `0 0 10px ${statusColor}`,
                    }}
                    initial={{ y: particle.y, opacity: 1 }}
                    animate={{ y: -20, opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                />
            ))}

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="p-2 rounded-lg"
                        style={{
                            background: `${statusColor}20`,
                        }}
                    >
                        <Icon className="w-5 h-5" style={{ color: statusColor }} />
                    </div>
                    <span className="text-sm font-medium text-gray-300">{title}</span>
                </div>
            </div>

            {/* Value */}
            <div className="relative z-10 flex items-baseline gap-2 mb-3">
                <motion.span
                    className="text-3xl font-bold text-white"
                    key={String(displayValue)}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {typeof displayValue === 'number' ? Math.round(displayValue) : displayValue}
                </motion.span>
                {unit && <span className="text-sm text-gray-400">{unit}</span>}
            </div>

            {/* Progress bar */}
            {type !== 'text' && (
                <div className="relative z-10 h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            background: `linear-gradient(90deg, ${statusColor}, ${statusColor}cc)`,
                            boxShadow: `0 0 10px ${statusColor}80`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, percentage)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            )}

            {/* Target range indicator */}
            {target && type !== 'text' && (
                <div className="relative z-10 mt-2 text-xs text-gray-400 flex items-center gap-1">
                    <span>Target:</span>
                    {target.min !== undefined && <span>{target.min}</span>}
                    {target.min !== undefined && target.max !== undefined && <span>-</span>}
                    {target.max !== undefined && <span>{target.max}</span>}
                    {unit && <span>{unit}</span>}
                </div>
            )}

            {/* Hover glow effect */}
            <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    boxShadow: `0 0 30px ${statusColor}40`,
                }}
            />
        </motion.div>
    );
};
