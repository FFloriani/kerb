'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Users } from 'lucide-react';

interface SpinWheelProps {
    participants: { id: string; name: string }[];
    chosenParticipants: string[];
    setChosenParticipants: (ids: string[]) => void;
    onClose: () => void;
}

const COLORS = [
    '#FFD700', // Gold
    '#DAA520', // Goldenrod
    '#B8860B', // DarkGoldenrod
    '#CD853F', // Peru
    '#D2691E', // Chocolate
    '#8B4513', // SaddleBrown
    '#F4A460', // SandyBrown
    '#DEB887', // BurlyWood
];

export default function SpinWheel({ participants, chosenParticipants, setChosenParticipants, onClose }: SpinWheelProps) {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [showWinner, setShowWinner] = useState(false);
    const wheelRef = useRef<SVGSVGElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cria som de clique usando Web Audio API
    const playTickSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 800 + Math.random() * 400; // Som variado
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    };

    // Som de vitória
    const playWinSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = ctx.currentTime + i * 0.15;
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    };

    // Participantes restantes (não escolhidos ainda)
    const remainingParticipants = participants.filter(p => !chosenParticipants.includes(p.id));

    // Se todos foram escolhidos, reseta automaticamente
    useEffect(() => {
        if (remainingParticipants.length === 0 && participants.length > 0) {
            setChosenParticipants([]);
            setRotation(0);
            setWinner(null);
            setShowWinner(false);
        }
    }, [remainingParticipants.length, participants.length, setChosenParticipants]);

    const activeParticipants = remainingParticipants.length > 0 ? remainingParticipants : participants;
    const segmentAngle = 360 / activeParticipants.length;

    const spin = () => {
        if (spinning || activeParticipants.length < 2) return;

        setSpinning(true);
        setWinner(null);
        setShowWinner(false);

        // Captura os participantes atuais
        const currentParticipants = [...activeParticipants];
        const numSegments = currentParticipants.length;
        const segmentSize = 360 / numSegments;

        // Escolhe o vencedor aleatoriamente
        const winnerIndex = Math.floor(Math.random() * numSegments);
        const chosenOne = currentParticipants[winnerIndex];

        // Os segmentos são desenhados assim:
        // - Segmento 0: de 0° a segmentSize (após ajuste de -90° no desenho)
        // - Segmento 1: de segmentSize a 2*segmentSize
        // - etc.
        // A seta está no topo (0° após ajuste)

        // Para que o segmento winnerIndex fique sob a seta:
        // Precisamos girar para que o centro do segmento winnerIndex fique em 0°
        // Centro do segmento i está em: i * segmentSize + segmentSize/2
        // Queremos girar NEGATIVAMENTE para trazer esse ponto para 0
        // Ou seja, girar: -(winnerIndex * segmentSize + segmentSize/2)
        // Como giramos positivamente (sentido horário), equivale a:
        // 360 - (winnerIndex * segmentSize + segmentSize/2)

        const centerOfWinnerSegment = winnerIndex * segmentSize + segmentSize / 2;
        const angleToWinner = 360 - centerOfWinnerSegment;

        // Normaliza rotação atual para saber quantas voltas já demos
        const currentFullRotations = Math.floor(rotation / 360);

        // Adiciona 5-7 voltas extras + o ângulo exato para o vencedor
        const extraSpins = (Math.floor(Math.random() * 3) + 5) * 360;
        const newRotation = (currentFullRotations * 360) + extraSpins + angleToWinner;

        setRotation(newRotation);

        // Revela o vencedor após a animação
        setTimeout(() => {
            setWinner(chosenOne.name);
            setShowWinner(true);
            setSpinning(false);

            // Adiciona à lista de escolhidos
            setChosenParticipants([...chosenParticipants, chosenOne.id]);

            // Som de vitória
            playWinSound();
        }, 5000);
    };

    const resetAll = () => {
        setChosenParticipants([]);
        setRotation(0);
        setWinner(null);
        setShowWinner(false);
    };

    // Calcula o tamanho da fonte baseado no número de participantes
    const getFontSize = () => {
        const count = activeParticipants.length;
        if (count <= 2) return 18;
        if (count <= 4) return 16;
        if (count <= 6) return 14;
        if (count <= 8) return 12;
        return 10;
    };

    // Generate wheel segments
    const generateSegments = () => {
        const segments = [];
        const radius = 150;
        const centerX = 175;
        const centerY = 175;
        const fontSize = getFontSize();

        for (let i = 0; i < activeParticipants.length; i++) {
            const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArc = segmentAngle > 180 ? 1 : 0;
            const pathD = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            // Text position (middle of segment)
            const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
            const textRadius = radius * 0.6;
            const textX = centerX + textRadius * Math.cos(midAngle);
            const textY = centerY + textRadius * Math.sin(midAngle);
            const textRotation = (i + 0.5) * segmentAngle;

            // Limita o nome baseado no espaço disponível
            const maxChars = activeParticipants.length <= 4 ? 12 : 8;
            const displayName = activeParticipants[i].name.length > maxChars
                ? activeParticipants[i].name.substring(0, maxChars) + '...'
                : activeParticipants[i].name;

            segments.push(
                <g key={activeParticipants[i].id}>
                    <path
                        d={pathD}
                        fill={COLORS[i % COLORS.length]}
                        stroke="#1a1a0f"
                        strokeWidth="2"
                    />
                    <text
                        x={textX}
                        y={textY}
                        fill="#1a1a0f"
                        fontSize={fontSize}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        style={{
                            textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                            fontFamily: 'var(--font-cinzel), serif',
                            textTransform: 'uppercase'
                        }}
                    >
                        {displayName}
                    </text>
                </g>
            );
        }
        return segments;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            style={{ zIndex: 200 }}
            onClick={(e) => e.target === e.currentTarget && !spinning && onClose()}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative bg-gradient-to-b from-[#1a1a0f] to-[#0f0f08] border border-yellow-500/30 rounded-3xl p-8 shadow-2xl max-w-lg w-full mx-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold gold-text font-cinzel">ROLETA DA CALL</h2>
                    <button
                        onClick={onClose}
                        disabled={spinning}
                        className="text-yellow-500/50 hover:text-yellow-400 p-2 rounded-full hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Status - quantos faltam */}
                <div className="flex items-center justify-center gap-2 mb-4 text-yellow-400/70 text-sm">
                    <Users size={16} />
                    <span>
                        {chosenParticipants.length > 0
                            ? `${activeParticipants.length} restante(s) de ${participants.length}`
                            : `${participants.length} participante(s)`
                        }
                    </span>
                </div>

                {/* Wheel Container */}
                <div className="relative flex items-center justify-center mb-6">
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 -mt-2">
                        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
                    </div>

                    {/* Wheel */}
                    <motion.div
                        animate={{ rotate: rotation }}
                        transition={{
                            duration: 5,
                            ease: [0.2, 0.8, 0.2, 1]
                        }}
                        className="relative"
                    >
                        <svg
                            ref={wheelRef}
                            width="350"
                            height="350"
                            viewBox="0 0 350 350"
                            className="drop-shadow-2xl"
                        >
                            <circle
                                cx="175"
                                cy="175"
                                r="165"
                                fill="none"
                                stroke="url(#goldGradient)"
                                strokeWidth="8"
                            />
                            {generateSegments()}
                            <circle
                                cx="175"
                                cy="175"
                                r="25"
                                fill="url(#centerGradient)"
                                stroke="#FFD700"
                                strokeWidth="3"
                            />
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFD700" />
                                    <stop offset="50%" stopColor="#B8860B" />
                                    <stop offset="100%" stopColor="#FFD700" />
                                </linearGradient>
                                <radialGradient id="centerGradient">
                                    <stop offset="0%" stopColor="#FFD700" />
                                    <stop offset="100%" stopColor="#B8860B" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Decorative lights */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className={`absolute w-3 h-3 rounded-full ${spinning ? 'animate-pulse' : ''}`}
                                style={{
                                    background: spinning ? '#FFD700' : '#8B6914',
                                    boxShadow: spinning ? '0 0 10px #FFD700' : 'none',
                                    top: `${50 + 48 * Math.cos((i * 30 - 90) * Math.PI / 180)}%`,
                                    left: `${50 + 48 * Math.sin((i * 30 - 90) * Math.PI / 180)}%`,
                                    transform: 'translate(-50%, -50%)',
                                    animationDelay: `${i * 0.1}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Winner Announcement */}
                <AnimatePresence>
                    {showWinner && winner && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center mb-6 p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/40"
                        >
                            <p className="text-yellow-400 text-sm mb-1">🎉 A CALL É DO:</p>
                            <p className="text-3xl font-bold gold-text font-cinzel">{winner}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chosen participants list */}
                {chosenParticipants.length > 0 && (
                    <div className="mb-4 p-3 bg-black/30 rounded-xl border border-yellow-500/20">
                        <p className="text-yellow-500/60 text-xs mb-2 uppercase tracking-wider">Já escolhidos:</p>
                        <div className="flex flex-wrap gap-2">
                            {chosenParticipants.map(id => {
                                const p = participants.find(x => x.id === id);
                                return p ? (
                                    <span key={id} className="px-2 py-1 bg-yellow-900/30 text-yellow-400/70 rounded text-xs">
                                        {p.name}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={spin}
                        disabled={spinning || activeParticipants.length < 2}
                        className="flex-1 btn-gold py-4 px-6 rounded-xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {spinning ? 'GIRANDO...' : activeParticipants.length < 2 ? 'PRECISA DE 2+' : 'GIRAR ROLETA'}
                    </button>
                    {chosenParticipants.length > 0 && (
                        <button
                            onClick={resetAll}
                            disabled={spinning}
                            className="p-4 rounded-xl border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
                            title="Resetar todos"
                        >
                            <RotateCcw size={24} />
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

