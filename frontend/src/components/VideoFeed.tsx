import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CameraOff, Eye } from 'lucide-react';

interface VideoFeedProps {
    stream: MediaStream | null;
    isActive: boolean;
    eyeContact: number;
    posture: number;
}

export const VideoFeed = ({ stream, isActive, eyeContact, posture }: VideoFeedProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [gazePosition, setGazePosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    // Simulate gaze tracking (in production, use MediaPipe FaceMesh)
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setGazePosition({
                x: 50 + (Math.random() - 0.5) * 20,
                y: 50 + (Math.random() - 0.5) * 20,
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isActive]);

    const getEyeContactColor = () => {
        if (eyeContact >= 70) return '#10b981';
        if (eyeContact >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const getPostureColor = () => {
        if (posture >= 80) return '#10b981';
        if (posture >= 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden glass">
            {isActive && stream ? (
                <>
                    {/* Video element */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {/* Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Gaze reticle */}
                        <motion.div
                            className="absolute w-12 h-12 border-2 rounded-full"
                            style={{
                                borderColor: getEyeContactColor(),
                                left: `${gazePosition.x}%`,
                                top: `${gazePosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                boxShadow: `0 0 20px ${getEyeContactColor()}80`,
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: getEyeContactColor() }}
                                />
                            </div>
                        </motion.div>

                        {/* Center target for eye contact */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <motion.div
                                className="w-16 h-16 border-2 border-dashed rounded-full opacity-30"
                                style={{ borderColor: getEyeContactColor() }}
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />
                        </div>

                        {/* Posture skeleton overlay (simplified) */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="glass-dark rounded-lg p-3 flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ background: getPostureColor() }}
                                />
                                <div className="flex-1">
                                    <div className="text-xs text-gray-300 mb-1">Posture</div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: getPostureColor() }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${posture}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-white">{Math.round(posture)}%</div>
                            </div>
                        </div>

                        {/* Eye contact indicator */}
                        <div className="absolute top-4 left-4 right-4">
                            <div className="glass-dark rounded-lg p-3 flex items-center gap-3">
                                <Eye className="w-5 h-5" style={{ color: getEyeContactColor() }} />
                                <div className="flex-1">
                                    <div className="text-xs text-gray-300 mb-1">Eye Contact</div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: getEyeContactColor() }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${eyeContact}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-white">{Math.round(eyeContact)}%</div>
                            </div>
                        </div>

                        {/* Corner frame indicators */}
                        {[
                            { top: 0, left: 0 },
                            { top: 0, right: 0 },
                            { bottom: 0, left: 0 },
                            { bottom: 0, right: 0 },
                        ].map((pos, idx) => (
                            <motion.div
                                key={idx}
                                className="absolute w-8 h-8 border-2"
                                style={{
                                    ...pos,
                                    borderColor: getEyeContactColor(),
                                    borderTop: pos.top === 0 ? `2px solid ${getEyeContactColor()}` : 'none',
                                    borderBottom: pos.bottom === 0 ? `2px solid ${getEyeContactColor()}` : 'none',
                                    borderLeft: pos.left === 0 ? `2px solid ${getEyeContactColor()}` : 'none',
                                    borderRight: pos.right === 0 ? `2px solid ${getEyeContactColor()}` : 'none',
                                }}
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: idx * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/50">
                    <CameraOff className="w-16 h-16 text-gray-500 mb-4" />
                    <p className="text-gray-400 text-sm">Camera is off</p>
                    <p className="text-gray-500 text-xs mt-1">Click "Live Cam" to start</p>
                </div>
            )}

            {/* Recording indicator */}
            {isActive && (
                <motion.div
                    className="absolute top-4 right-4 flex items-center gap-2 glass-dark px-3 py-2 rounded-full"
                    animate={{
                        opacity: [1, 0.5, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                >
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-white font-medium">LIVE</span>
                </motion.div>
            )}
        </div>
    );
};
