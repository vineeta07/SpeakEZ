import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, RotateCcw, Target } from 'lucide-react';

interface HeaderProps {
    isAudioActive: boolean;
    isVideoActive: boolean;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    onReset: () => void;
}

export const Header = ({
    isAudioActive,
    isVideoActive,
    onToggleAudio,
    onToggleVideo,
    onReset,
}: HeaderProps) => {
    return (
        <header className="glass-dark border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center gap-4">
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 blur-lg opacity-50"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gradient">
                                SPEAKEZ v2.0
                            </h1>
                            <p className="text-xs text-gray-400">
                                Real-Time Speech Intelligence Platform
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    {/* Audio Toggle */}
                    <motion.button
                        onClick={onToggleAudio}
                        className={`
              p-3 rounded-lg font-medium transition-all duration-300
              ${isAudioActive
                                ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                                : 'bg-red-500/20 border-2 border-red-500 text-red-400'
                            }
            `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={isAudioActive ? 'Mute Microphone' : 'Unmute Microphone'}
                    >
                        {isAudioActive ? (
                            <Mic className="w-5 h-5" />
                        ) : (
                            <MicOff className="w-5 h-5" />
                        )}
                    </motion.button>

                    {/* Video Toggle */}
                    <motion.button
                        onClick={onToggleVideo}
                        className={`
              p-3 rounded-lg font-medium transition-all duration-300
              ${isVideoActive
                                ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                                : 'bg-red-500/20 border-2 border-red-500 text-red-400'
                            }
            `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={isVideoActive ? 'Turn Off Camera' : 'Turn On Camera'}
                    >
                        {isVideoActive ? (
                            <Video className="w-5 h-5" />
                        ) : (
                            <VideoOff className="w-5 h-5" />
                        )}
                    </motion.button>

                    {/* Reset Button */}
                    <motion.button
                        onClick={onReset}
                        className="px-4 py-3 rounded-lg font-medium bg-white/5 border-2 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center gap-2">
                            <RotateCcw className="w-5 h-5" />
                            <span>Reset</span>
                        </div>
                    </motion.button>
                </div>
            </div>
        </header>
    );
};
