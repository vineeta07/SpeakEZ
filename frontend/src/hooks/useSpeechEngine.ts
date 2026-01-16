import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechMetrics, ParticleEffect } from '../types';

// Mock real-time speech metrics (in production, this would connect to actual speech analysis API)
export const useSpeechEngine = (isActive: boolean) => {
    const [metrics, setMetrics] = useState<SpeechMetrics>({
        pace: 120,
        stress: 15,
        fillerCount: 0,
        pitch: 'normal',
        volume: 50,
        eyeContact: 75,
        posture: 85,
        gesturesDetected: false,
        headPosition: { x: 0, y: 0, z: 0 },
        clarity: 80,
        logic: 75,
        toneMatch: 85,
        emotionDetected: 'neutral',
        confidence: 78,
        confidenceTrend: Array(30).fill(78),
    });

    const [particles, setParticles] = useState<ParticleEffect[]>([]);
    const animationFrameRef = useRef<number>();

    // Simulate real-time metric updates
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setMetrics((prev) => {
                // Simulate natural variations in metrics
                const newPace = Math.max(80, Math.min(180, prev.pace + (Math.random() - 0.5) * 10));
                const newStress = Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.5) * 5));
                const newEyeContact = Math.max(0, Math.min(100, prev.eyeContact + (Math.random() - 0.5) * 8));
                const newPosture = Math.max(0, Math.min(100, prev.posture + (Math.random() - 0.5) * 5));
                const newClarity = Math.max(0, Math.min(100, prev.clarity + (Math.random() - 0.5) * 6));
                const newLogic = Math.max(0, Math.min(100, prev.logic + (Math.random() - 0.5) * 4));
                const newToneMatch = Math.max(0, Math.min(100, prev.toneMatch + (Math.random() - 0.5) * 7));

                // Calculate unified confidence score (weighted average)
                const confidence = Math.round(
                    newPace * 0.15 +
                    (100 - newStress) * 0.15 +
                    newEyeContact * 0.2 +
                    newPosture * 0.15 +
                    newClarity * 0.15 +
                    newLogic * 0.1 +
                    newToneMatch * 0.1
                ) / 100 * 100;

                // Update trend (keep last 30 data points)
                const newTrend = [...prev.confidenceTrend.slice(1), confidence];

                return {
                    ...prev,
                    pace: newPace,
                    stress: newStress,
                    eyeContact: newEyeContact,
                    posture: newPosture,
                    clarity: newClarity,
                    logic: newLogic,
                    toneMatch: newToneMatch,
                    confidence,
                    confidenceTrend: newTrend,
                    fillerCount: Math.random() > 0.95 ? prev.fillerCount + 1 : prev.fillerCount,
                    gesturesDetected: Math.random() > 0.7,
                };
            });
        }, 100); // 10fps updates

        return () => clearInterval(interval);
    }, [isActive]);

    // Particle system based on confidence
    useEffect(() => {
        if (!isActive) return;

        const generateParticles = () => {
            const { confidence, stress } = metrics;

            // Generate particles based on confidence level
            if (confidence > 75 && Math.random() > 0.7) {
                const newParticle: ParticleEffect = {
                    id: `particle-${Date.now()}-${Math.random()}`,
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight,
                    type: 'golden',
                    velocity: { x: (Math.random() - 0.5) * 2, y: -2 - Math.random() * 2 },
                };
                setParticles((prev) => [...prev, newParticle]);
            }

            // Generate stress particles
            if (stress > 50 && Math.random() > 0.8) {
                const newParticle: ParticleEffect = {
                    id: `particle-${Date.now()}-${Math.random()}`,
                    x: Math.random() * window.innerWidth,
                    y: 0,
                    type: 'red',
                    velocity: { x: (Math.random() - 0.5) * 2, y: 2 + Math.random() * 2 },
                };
                setParticles((prev) => [...prev, newParticle]);
            }

            // Clean up old particles
            setParticles((prev) => prev.filter((p) => {
                const age = Date.now() - parseInt(p.id.split('-')[1]);
                return age < 2000;
            }));
        };

        const particleInterval = setInterval(generateParticles, 200);
        return () => clearInterval(particleInterval);
    }, [isActive, metrics.confidence, metrics.stress]);

    return { metrics, particles };
};

// Hook for managing media devices (camera and microphone)
export const useMediaDevices = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isVideoActive, setIsVideoActive] = useState(false);
    const [isAudioActive, setIsAudioActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startVideo = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: true,
            });
            setStream(mediaStream);
            setIsVideoActive(true);
            setIsAudioActive(true);
            setError(null);
        } catch (err) {
            setError('Failed to access camera/microphone. Please grant permissions.');
            console.error('Media device error:', err);
        }
    }, []);

    const stopVideo = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
            setIsVideoActive(false);
            setIsAudioActive(false);
        }
    }, [stream]);

    const toggleVideo = useCallback(() => {
        if (isVideoActive) {
            stopVideo();
        } else {
            startVideo();
        }
    }, [isVideoActive, startVideo, stopVideo]);

    const toggleAudio = useCallback(() => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioActive(audioTrack.enabled);
            }
        }
    }, [stream]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return {
        stream,
        isVideoActive,
        isAudioActive,
        error,
        startVideo,
        stopVideo,
        toggleVideo,
        toggleAudio,
    };
};
