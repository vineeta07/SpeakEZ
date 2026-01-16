import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ConfidenceGaugeProps {
    confidence: number;
    trend: number[];
    scenario: string;
}

export const ConfidenceGauge = ({ confidence, trend, scenario }: ConfidenceGaugeProps) => {
    const [displayConfidence, setDisplayConfidence] = useState(confidence);

    useEffect(() => {
        // Smooth animation for confidence changes
        const timer = setTimeout(() => {
            setDisplayConfidence(confidence);
        }, 50);
        return () => clearTimeout(timer);
    }, [confidence]);

    // Determine color based on confidence level
    const getColor = () => {
        if (confidence >= 80) return { main: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' };
        if (confidence >= 50) return { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' };
        return { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' };
    };

    const getLabel = () => {
        if (confidence >= 80) return 'PRO';
        if (confidence >= 50) return 'GOOD';
        return 'PRACTICE';
    };

    const getTrendIcon = () => {
        if (trend.length < 2) return <Minus className="w-5 h-5" />;
        const recentTrend = trend[trend.length - 1] - trend[trend.length - 10];
        if (recentTrend > 5) return <TrendingUp className="w-5 h-5 text-green-400" />;
        if (recentTrend < -5) return <TrendingDown className="w-5 h-5 text-red-400" />;
        return <Minus className="w-5 h-5 text-gray-400" />;
    };

    const color = getColor();
    const circumference = 2 * Math.PI * 85;
    const strokeDashoffset = circumference - (confidence / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            {/* Outer glow ring */}
            <motion.div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                    background: color.glow,
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Main gauge container */}
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Background circle */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="85"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="12"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        cx="128"
                        cy="128"
                        r="85"
                        stroke={color.main}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{
                            filter: `drop-shadow(0 0 10px ${color.glow})`,
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <motion.div
                        className="text-7xl font-bold text-white"
                        key={displayConfidence}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {Math.round(displayConfidence)}
                    </motion.div>
                    <div className="text-sm text-gray-400 mt-1">/ 100</div>
                    <motion.div
                        className="mt-2 px-4 py-1 rounded-full text-xs font-bold tracking-wider"
                        style={{
                            background: color.main,
                            color: 'white',
                        }}
                        animate={{
                            boxShadow: [
                                `0 0 10px ${color.glow}`,
                                `0 0 20px ${color.glow}`,
                                `0 0 10px ${color.glow}`,
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {getLabel()}
                    </motion.div>
                </div>

                {/* Pulsing rings */}
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-2"
                        style={{
                            borderColor: color.main,
                            opacity: 0,
                        }}
                        animate={{
                            scale: [1, 1.5],
                            opacity: [0.5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: 'easeOut',
                        }}
                    />
                ))}
            </div>

            {/* Trend indicator */}
            <div className="mt-4 flex items-center gap-2 glass px-4 py-2 rounded-full">
                {getTrendIcon()}
                <span className="text-sm text-white font-medium">Trend</span>
            </div>

            {/* Mini sparkline */}
            <div className="mt-3 w-48 h-12 glass rounded-lg p-2">
                <svg width="100%" height="100%" viewBox="0 0 180 32">
                    <polyline
                        points={trend
                            .slice(-30)
                            .map((val, idx) => `${idx * 6},${32 - (val / 100) * 28}`)
                            .join(' ')}
                        fill="none"
                        stroke={color.main}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <defs>
                        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={color.main} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color.main} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`0,32 ${trend
                            .slice(-30)
                            .map((val, idx) => `${idx * 6},${32 - (val / 100) * 28}`)
                            .join(' ')} 180,32`}
                        fill="url(#sparkline-gradient)"
                    />
                </svg>
            </div>
        </div>
    );
};
