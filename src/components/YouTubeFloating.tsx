'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Music2, Minimize2, Link as LinkIcon, Volume2, GripHorizontal, Heart, ListMusic, X } from 'lucide-react';

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

interface PlaylistItem {
    id: string;
    title: string;
    url: string;
}

const DEFAULT_SUGGESTIONS = [
    { title: 'Lofi Girl', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { title: 'Rain Sounds', url: 'https://www.youtube.com/watch?v=mPZkdNFkNps' },
    { title: 'Classical', url: 'https://www.youtube.com/watch?v=R03h7J2l50I' }
];

export default function YouTubeFloating() {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [volume, setVolume] = useState(50);
    const [player, setPlayer] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [videoTitle, setVideoTitle] = useState('');
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);

    const playerContainerRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();
    const constraintsRef = useRef(null);
    const isDraggingRef = useRef(false);

    // Load playlist from localStorage
    useEffect(() => {
        setMounted(true);
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Load playlist from localStorage
        const saved = localStorage.getItem('kerb-youtube-playlist');
        if (saved) {
            try {
                setPlaylist(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading playlist', e);
            }
        }
    }, []);

    // Save playlist to localStorage
    useEffect(() => {
        if (mounted && playlist.length > 0) {
            localStorage.setItem('kerb-youtube-playlist', JSON.stringify(playlist));
        }
    }, [playlist, mounted]);

    const addToPlaylist = () => {
        if (!currentUrl) return;
        if (playlist.some(item => item.url === currentUrl)) return;

        const newItem: PlaylistItem = {
            id: Date.now().toString(),
            title: videoTitle || "Música sem título",
            url: currentUrl
        };
        setPlaylist([...playlist, newItem]);
    };

    const removeFromPlaylist = (id: string) => {
        const newPlaylist = playlist.filter(item => item.id !== id);
        setPlaylist(newPlaylist);
        if (newPlaylist.length === 0) {
            localStorage.removeItem('kerb-youtube-playlist');
        }
    };

    const getVideoId = (url: string) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const loadVideo = (url: string, volOverride?: number) => {
        const videoId = getVideoId(url);
        if (!videoId) return;

        setCurrentUrl(url);
        setInputValue(url);
        const vol = volOverride ?? volume;

        if (player && typeof player.loadVideoById === 'function') {
            player.loadVideoById(videoId);
            player.setVolume(vol);
        } else {
            createPlayer(videoId, vol);
        }
    };

    const createPlayer = (videoId: string, startVol: number) => {
        const init = () => {
            if (window.YT && window.YT.Player) {
                const existingFrame = document.getElementById('yt-player-target-kerb');
                if (!existingFrame || existingFrame.tagName !== 'IFRAME') {
                    if (playerContainerRef.current) playerContainerRef.current.innerHTML = '<div id="yt-player-target-kerb"></div>';

                    new window.YT.Player('yt-player-target-kerb', {
                        height: '100%',
                        width: '100%',
                        videoId: videoId,
                        playerVars: {
                            'playsinline': 1,
                            'controls': 1,
                            'autoplay': 1,
                            'disablekb': 1,
                        },
                        events: {
                            'onReady': (event: any) => {
                                event.target.setVolume(startVol);
                                const data = event.target.getVideoData();
                                if (data && data.title) setVideoTitle(data.title);
                                setPlayer(event.target);
                            },
                            'onStateChange': (event: any) => {
                                if (event.target.getVideoData) {
                                    const data = event.target.getVideoData();
                                    if (data && data.title) setVideoTitle(data.title);
                                }
                            }
                        }
                    });
                }
            } else {
                setTimeout(init, 500);
            }
        };
        init();
    };

    const handleVolumeChange = (newVol: number) => {
        setVolume(newVol);
        if (player && typeof player.setVolume === 'function') {
            player.setVolume(newVol);
        }
    };

    const isCurrentSaved = playlist.some(p => p.url === currentUrl);

    if (!mounted) return null;

    return (
        <>
            <div ref={constraintsRef} className="fixed inset-4 pointer-events-none" style={{ zIndex: 99 }} />

            <motion.div
                drag
                dragListener={false}
                dragControls={dragControls}
                dragConstraints={constraintsRef}
                dragElastic={0}
                dragMomentum={false}
                onDragStart={() => {
                    setIsDragging(true);
                    isDraggingRef.current = true;
                }}
                onDragEnd={() => {
                    setIsDragging(false);
                    setTimeout(() => { isDraggingRef.current = false; }, 150);
                }}
                initial={{ x: 20, y: 20, opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ willChange: 'transform', zIndex: 100 }}
                className={`fixed bottom-24 right-8 flex items-start pointer-events-none ${isExpanded ? 'h-auto' : 'h-14'}`}
            >
                {/* Main Player Card */}
                <div className={`bg-black/90 border border-yellow-500/30 shadow-2xl overflow-hidden pointer-events-auto transition-all duration-300 relative ${isExpanded ? 'rounded-2xl w-[300px]' : 'rounded-full w-14 h-14'}`}>

                    {/* Header */}
                    <div
                        onPointerDown={(e) => dragControls.start(e)}
                        className="flex items-center justify-between p-3 cursor-grab active:cursor-grabbing bg-gradient-to-r from-yellow-900/30 to-transparent border-b border-yellow-500/20 h-14 relative touch-none group"
                    >
                        <div className="flex items-center gap-3 pointer-events-none select-none flex-1 min-w-0 mr-2">
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${currentUrl ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'bg-yellow-900/50'}`}>
                                {isDragging ? <GripHorizontal size={16} className="text-black animate-pulse" /> : <Music2 size={16} className="text-black" />}
                            </div>

                            {isExpanded && (
                                <div className="flex items-center gap-2 flex-1 min-w-0 pointer-events-auto">
                                    <span className="text-xs font-bold text-yellow-100 truncate flex-1 leading-tight">
                                        {videoTitle || "YouTube Player"}
                                    </span>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                isCurrentSaved ? removeFromPlaylist(playlist.find(p => p.url === currentUrl)?.id!) : addToPlaylist();
                                            }}
                                            disabled={!currentUrl}
                                            className={`p-1.5 rounded-full hover:bg-yellow-500/20 transition-colors disabled:opacity-30 ${isCurrentSaved ? 'text-yellow-400' : 'text-yellow-600'}`}
                                            title={isCurrentSaved ? "Remover da Playlist" : "Salvar na Playlist"}
                                        >
                                            <Heart size={14} fill={isCurrentSaved ? "currentColor" : "none"} />
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowPlaylist(!showPlaylist); }}
                                            className={`p-1.5 rounded-full hover:bg-yellow-500/20 transition-colors ${showPlaylist ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600'}`}
                                            title="Minha Playlist"
                                        >
                                            <ListMusic size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Minimize/Expand Button */}
                        {isExpanded ? (
                            <button
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => { setIsExpanded(false); setShowPlaylist(false); }}
                                className="text-yellow-400 hover:text-yellow-200 p-2 hover:bg-yellow-500/20 rounded-full cursor-pointer pointer-events-auto transition-colors flex-shrink-0 ml-1"
                                title="Minimizar"
                            >
                                <Minimize2 size={18} />
                            </button>
                        ) : (
                            <button
                                onPointerDown={(e) => dragControls.start(e)}
                                onClick={() => {
                                    if (!isDraggingRef.current) setIsExpanded(true);
                                }}
                                className="absolute inset-0 z-10 cursor-pointer"
                                aria-label="Expandir"
                            />
                        )}
                    </div>

                    {/* Video Player */}
                    <div className={`relative w-full bg-black transition-all duration-300 ${isExpanded ? 'aspect-video opacity-100 h-auto' : 'h-0 opacity-0 pointer-events-none overflow-hidden'}`}>
                        <div ref={playerContainerRef} className="w-full h-full">
                            <div id="yt-player-target-kerb" className="w-full h-full" />
                        </div>

                        {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}

                        {!currentUrl && isExpanded && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-500/50 gap-2 pointer-events-none select-none">
                                <Music2 size={32} opacity={0.3} />
                                <span className="text-xs">Cole um link para começar</span>
                                <div className="flex flex-wrap gap-2 mt-2 pointer-events-auto">
                                    {DEFAULT_SUGGESTIONS.map(s => (
                                        <button
                                            key={s.title}
                                            onClick={() => loadVideo(s.url)}
                                            className="text-[10px] px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded-full transition-colors"
                                        >
                                            {s.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    {isExpanded && (
                        <div className="p-3 bg-black/80 border-t border-yellow-500/20">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative group">
                                    <form onSubmit={(e) => { e.preventDefault(); loadVideo(inputValue); }} className="relative flex items-center">
                                        <LinkIcon size={12} className="absolute left-2 text-yellow-500/50" />
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="YouTube URL..."
                                            className="w-full bg-yellow-900/20 text-yellow-100 text-[10px] py-1.5 pl-7 pr-2 rounded-lg border border-yellow-500/20 focus:border-yellow-500 focus:bg-black outline-none placeholder:text-yellow-500/40 transition-all h-8"
                                        />
                                    </form>
                                </div>

                                <div className="w-20 flex items-center gap-1.5">
                                    <Volume2 size={12} className="text-yellow-500/50" />
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={volume}
                                        onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                                        className="w-full h-1 bg-yellow-900/50 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Playlist Drawer */}
                <AnimatePresence>
                    {isExpanded && showPlaylist && (
                        <motion.div
                            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                            animate={{ width: 220, opacity: 1, marginLeft: 12 }}
                            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                            className="h-[280px] bg-black/90 border border-yellow-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
                        >
                            <div className="p-3 border-b border-yellow-500/20 bg-gradient-to-r from-yellow-900/30 to-transparent flex items-center justify-between">
                                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Sua Playlist</span>
                                <button onClick={() => setShowPlaylist(false)} className="text-yellow-600 hover:text-yellow-400">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide space-y-1">
                                {playlist.length > 0 ? (
                                    playlist.map(item => (
                                        <div key={item.id} className="group relative flex items-center gap-2 p-2 rounded-lg hover:bg-yellow-500/10 transition-colors cursor-pointer" onClick={() => loadVideo(item.url)}>
                                            <div className="w-1 h-8 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 transition-colors" />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[10px] truncate leading-tight ${currentUrl === item.url ? 'text-yellow-400 font-medium' : 'text-yellow-100/70'}`}>
                                                    {item.title}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFromPlaylist(item.id); }}
                                                className="opacity-0 group-hover:opacity-100 text-yellow-600 hover:text-red-500 p-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center">
                                        <p className="text-[10px] text-yellow-500/50 mb-4">Vazia.</p>
                                        <p className="text-[10px] text-yellow-600 font-medium mb-2">Sugestões:</p>
                                        <div className="space-y-2">
                                            {DEFAULT_SUGGESTIONS.map(s => (
                                                <button
                                                    key={s.title}
                                                    onClick={() => loadVideo(s.url)}
                                                    className="w-full text-left text-[10px] text-yellow-400 hover:underline"
                                                >
                                                    + {s.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
