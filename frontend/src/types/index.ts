export interface SpeechMetrics {
    // Voice Engine Metrics
    pace: number; // words per minute
    stress: number; // 0-100 percentage
    fillerCount: number;
    pitch: 'low' | 'normal' | 'high';
    volume: number; // 0-100

    // Non-Verbal Metrics
    eyeContact: number; // 0-100 percentage
    posture: number; // 0-100 percentage
    gesturesDetected: boolean;
    headPosition: { x: number; y: number; z: number };

    // Message Metrics
    clarity: number; // 0-100
    logic: number; // 0-100
    toneMatch: number; // 0-100
    emotionDetected: string;

    // Unified Confidence Score
    confidence: number; // 0-100
    confidenceTrend: number[]; // last 30 seconds
}

export interface FeedbackItem {
    id: string;
    timestamp: string;
    message: string;
    type: 'urgent' | 'positive' | 'suggestion' | 'info';
    icon: string;
    autoExpand?: boolean;
}

export type ScenarioType = 'debate' | 'interview' | 'sales' | 'team-meeting' | 'casual' | 'custom';

export interface ScenarioConfig {
    id: ScenarioType;
    name: string;
    description: string;
    colorScheme: {
        primary: string;
        secondary: string;
        gradient: string;
    };
    weights: {
        pace: number;
        clarity: number;
        eyeContact: number;
        posture: number;
        logic: number;
    };
    targetRanges: {
        pace: { min: number; max: number };
        eyeContact: { min: number; max: number };
        stress: { max: number };
    };
}

export interface TrainingChallenge {
    id: string;
    name: string;
    duration: number; // seconds
    targetMetric: keyof SpeechMetrics;
    targetValue: number;
    description: string;
    icon: string;
}

export interface SessionData {
    id: string;
    startTime: Date;
    endTime?: Date;
    scenario: ScenarioType;
    metrics: SpeechMetrics[];
    averageConfidence: number;
    peakConfidence: number;
    improvementAreas: string[];
}

export interface ParticleEffect {
    id: string;
    x: number;
    y: number;
    type: 'golden' | 'red' | 'neutral';
    velocity: { x: number; y: number };
}
