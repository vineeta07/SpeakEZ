import type { ScenarioConfig, ScenarioType } from '../types';

export const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
    debate: {
        id: 'debate',
        name: 'DEBATE',
        description: 'High-energy argumentative speaking',
        colorScheme: {
            primary: '#ef4444',
            secondary: '#f97316',
            gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
        },
        weights: {
            pace: 0.25,
            clarity: 0.2,
            eyeContact: 0.15,
            posture: 0.15,
            logic: 0.25,
        },
        targetRanges: {
            pace: { min: 140, max: 170 },
            eyeContact: { min: 60, max: 100 },
            stress: { max: 40 },
        },
    },
    interview: {
        id: 'interview',
        name: 'INTERVIEW',
        description: 'Professional and composed communication',
        colorScheme: {
            primary: '#3b82f6',
            secondary: '#06b6d4',
            gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        },
        weights: {
            pace: 0.15,
            clarity: 0.25,
            eyeContact: 0.25,
            posture: 0.2,
            logic: 0.15,
        },
        targetRanges: {
            pace: { min: 110, max: 140 },
            eyeContact: { min: 70, max: 100 },
            stress: { max: 25 },
        },
    },
    sales: {
        id: 'sales',
        name: 'SALES',
        description: 'Persuasive and engaging pitch',
        colorScheme: {
            primary: '#8b5cf6',
            secondary: '#ec4899',
            gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        },
        weights: {
            pace: 0.2,
            clarity: 0.2,
            eyeContact: 0.2,
            posture: 0.15,
            logic: 0.25,
        },
        targetRanges: {
            pace: { min: 130, max: 160 },
            eyeContact: { min: 75, max: 100 },
            stress: { max: 30 },
        },
    },
    'team-meeting': {
        id: 'team-meeting',
        name: 'TEAM MEETING',
        description: 'Collaborative and clear discussion',
        colorScheme: {
            primary: '#10b981',
            secondary: '#14b8a6',
            gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
        },
        weights: {
            pace: 0.15,
            clarity: 0.25,
            eyeContact: 0.2,
            posture: 0.15,
            logic: 0.25,
        },
        targetRanges: {
            pace: { min: 120, max: 150 },
            eyeContact: { min: 65, max: 100 },
            stress: { max: 20 },
        },
    },
    casual: {
        id: 'casual',
        name: 'CASUAL',
        description: 'Relaxed and natural conversation',
        colorScheme: {
            primary: '#f59e0b',
            secondary: '#fbbf24',
            gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        },
        weights: {
            pace: 0.2,
            clarity: 0.2,
            eyeContact: 0.15,
            posture: 0.1,
            logic: 0.35,
        },
        targetRanges: {
            pace: { min: 100, max: 140 },
            eyeContact: { min: 50, max: 100 },
            stress: { max: 15 },
        },
    },
    custom: {
        id: 'custom',
        name: 'CUSTOM',
        description: 'Personalized settings',
        colorScheme: {
            primary: '#6366f1',
            secondary: '#a855f7',
            gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
        },
        weights: {
            pace: 0.2,
            clarity: 0.2,
            eyeContact: 0.2,
            posture: 0.2,
            logic: 0.2,
        },
        targetRanges: {
            pace: { min: 120, max: 150 },
            eyeContact: { min: 70, max: 100 },
            stress: { max: 30 },
        },
    },
};

export const getScenarioColor = (scenario: ScenarioType): string => {
    return SCENARIOS[scenario].colorScheme.gradient;
};

export const calculateConfidence = (
    metrics: any,
    scenario: ScenarioType
): number => {
    const config = SCENARIOS[scenario];
    const weights = config.weights;

    // Normalize pace to 0-100 scale based on target range
    const paceScore = Math.max(
        0,
        Math.min(
            100,
            ((metrics.pace - config.targetRanges.pace.min) /
                (config.targetRanges.pace.max - config.targetRanges.pace.min)) *
            100
        )
    );

    // Calculate weighted score
    const score =
        paceScore * weights.pace +
        metrics.clarity * weights.clarity +
        metrics.eyeContact * weights.eyeContact +
        metrics.posture * weights.posture +
        metrics.logic * weights.logic;

    return Math.round(score);
};
