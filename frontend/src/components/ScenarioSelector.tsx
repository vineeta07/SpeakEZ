import { motion } from 'framer-motion';
import type { ScenarioType } from '../types';
import { SCENARIOS } from '../config/scenarios';
import {
    MessageSquare,
    Briefcase,
    TrendingUp,
    Users,
    Coffee,
    Settings
} from 'lucide-react';

interface ScenarioSelectorProps {
    selected: ScenarioType;
    onSelect: (scenario: ScenarioType) => void;
}

const SCENARIO_ICONS = {
    debate: MessageSquare,
    interview: Briefcase,
    sales: TrendingUp,
    'team-meeting': Users,
    casual: Coffee,
    custom: Settings,
};

export const ScenarioSelector = ({ selected, onSelect }: ScenarioSelectorProps) => {
    return (
        <div className="flex flex-wrap gap-2 items-center">
            {Object.values(SCENARIOS).map((scenario) => {
                const Icon = SCENARIO_ICONS[scenario.id];
                const isSelected = selected === scenario.id;

                return (
                    <motion.button
                        key={scenario.id}
                        onClick={() => onSelect(scenario.id)}
                        className={`
              relative px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-300 overflow-hidden
              ${isSelected ? 'text-white' : 'text-gray-300 hover:text-white'}
            `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: isSelected
                                ? scenario.colorScheme.gradient
                                : 'rgba(255, 255, 255, 0.05)',
                            border: isSelected
                                ? `2px solid ${scenario.colorScheme.primary}`
                                : '2px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        {/* Background shimmer effect */}
                        {isSelected && (
                            <motion.div
                                className="absolute inset-0 shimmer"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                }}
                            />
                        )}

                        {/* Content */}
                        <div className="relative z-10 flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{scenario.name}</span>
                        </div>

                        {/* Glow effect */}
                        {isSelected && (
                            <motion.div
                                className="absolute inset-0 rounded-lg"
                                animate={{
                                    boxShadow: [
                                        `0 0 10px ${scenario.colorScheme.primary}40`,
                                        `0 0 20px ${scenario.colorScheme.primary}60`,
                                        `0 0 10px ${scenario.colorScheme.primary}40`,
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};
