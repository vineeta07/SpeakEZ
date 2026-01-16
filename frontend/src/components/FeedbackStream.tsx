import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    AlertCircle,
    CheckCircle,
    Lightbulb,
    Info,
    X
} from 'lucide-react';
import type { FeedbackItem } from '../types';

interface FeedbackStreamProps {
    metrics: any;
}

const FEEDBACK_ICONS = {
    urgent: AlertCircle,
    positive: CheckCircle,
    suggestion: Lightbulb,
    info: Info,
};

const FEEDBACK_COLORS = {
    urgent: { bg: '#ef444420', border: '#ef4444', text: '#fca5a5' },
    positive: { bg: '#10b98120', border: '#10b981', text: '#6ee7b7' },
    suggestion: { bg: '#f59e0b20', border: '#f59e0b', text: '#fcd34d' },
    info: { bg: '#3b82f620', border: '#3b82f6', text: '#93c5fd' },
};

export const FeedbackStream = ({ metrics }: FeedbackStreamProps) => {
    const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        // Generate feedback based on metrics
        const newFeedback: FeedbackItem[] = [];

        // Pace feedback
        if (metrics.pace > 160) {
            newFeedback.push({
                id: `pace-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                message: `You're rushing - target 120-140wpm (current: ${Math.round(metrics.pace)}wpm)`,
                type: 'urgent',
                icon: '🔥',
            });
        } else if (metrics.pace < 100) {
            newFeedback.push({
                id: `pace-slow-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                message: 'Speak a bit faster to maintain engagement',
                type: 'suggestion',
                icon: '⚡',
            });
        }

        // Eye contact feedback
        if (metrics.eyeContact > 75) {
            newFeedback.push({
                id: `eye-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                message: 'Great eye contact! Keep it up',
                type: 'positive',
                icon: '👁️',
            });
        } else if (metrics.eyeContact < 50) {
            newFeedback.push({
                id: `eye-low-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                message: 'Try to maintain more eye contact with the camera',
                type: 'urgent',
                icon: '👀',
            });
        }

        // Filler words feedback
        if (metrics.fillerCount > 0 && metrics.fillerCount % 3 === 0) {
            newFeedback.push({
                id: `filler-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                message: `Try: "Importantly..." instead of "Um" (${metrics.fillerCount} fillers detected)`,
                type: 'suggestion',
                icon: '💡',
            });
        }

        // Stress feedback
        if (metrics.stress > 50) {
            newFeedback.push({
                id: `stress-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                message: 'Take a deep breath - you\'re doing great!',
                type: 'suggestion',
                icon: '🧘',
            });
        }

        // Posture feedback
        if (metrics.posture > 85) {
            newFeedback.push({
                id: `posture-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                message: 'Excellent posture!',
                type: 'positive',
                icon: '✨',
            });
        }

        // Add new feedback items
        if (newFeedback.length > 0) {
            setFeedbackItems((prev) => {
                const combined = [...newFeedback, ...prev];
                return combined.slice(0, 20); // Keep last 20 items
            });
        }
    }, [
        metrics.pace,
        metrics.eyeContact,
        metrics.fillerCount,
        metrics.stress,
        metrics.posture,
    ]);

    // Auto-dismiss feedback after 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setFeedbackItems((prev) => {
                const now = Date.now();
                return prev.filter((item) => {
                    const itemTime = new Date(`1970-01-01 ${item.timestamp}`).getTime();
                    return now - itemTime < 4000;
                });
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleDismiss = (id: string) => {
        setFeedbackItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Live Feedback</h3>
                <div className="text-xs text-gray-400">
                    {feedbackItems.length} active
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                <AnimatePresence mode="popLayout">
                    {feedbackItems.map((item) => {
                        const Icon = FEEDBACK_ICONS[item.type];
                        const colors = FEEDBACK_COLORS[item.type];
                        const isExpanded = expandedId === item.id;

                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="relative group"
                            >
                                <div
                                    className="p-3 rounded-lg cursor-pointer transition-all duration-300"
                                    style={{
                                        background: colors.bg,
                                        border: `1px solid ${colors.border}40`,
                                    }}
                                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="p-2 rounded-lg flex-shrink-0"
                                            style={{
                                                background: `${colors.border}30`,
                                            }}
                                        >
                                            <Icon className="w-4 h-4" style={{ color: colors.border }} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg">{item.icon}</span>
                                                <span className="text-xs text-gray-400">{item.timestamp}</span>
                                            </div>
                                            <p
                                                className="text-sm font-medium leading-relaxed"
                                                style={{ color: colors.text }}
                                            >
                                                {item.message}
                                            </p>
                                        </div>

                                        {/* Dismiss button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDismiss(item.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Glow effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-lg pointer-events-none"
                                        animate={{
                                            boxShadow: [
                                                `0 0 0px ${colors.border}00`,
                                                `0 0 20px ${colors.border}40`,
                                                `0 0 0px ${colors.border}00`,
                                            ],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {feedbackItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Info className="w-12 h-12 mb-2 opacity-50" />
                        <p className="text-sm">Start speaking to receive feedback</p>
                    </div>
                )}
            </div>
        </div>
    );
};
