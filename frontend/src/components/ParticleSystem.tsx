import { motion, AnimatePresence } from 'framer-motion';
import type { ParticleEffect } from '../types';

interface ParticleSystemProps {
    particles: ParticleEffect[];
}

export const ParticleSystem = ({ particles }: ParticleSystemProps) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className={`absolute particle ${particle.type === 'golden' ? 'particle-golden' : 'particle-red'
                            }`}
                        initial={{
                            x: particle.x,
                            y: particle.y,
                            scale: 0,
                            opacity: 0,
                        }}
                        animate={{
                            x: particle.x + particle.velocity.x * 50,
                            y: particle.y + particle.velocity.y * 50,
                            scale: [0, 1, 0.8, 0],
                            opacity: [0, 1, 0.8, 0],
                        }}
                        exit={{
                            scale: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 2,
                            ease: 'easeOut',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
