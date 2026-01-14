'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTubeFloating from '@/components/YouTubeFloating';
import SpinWheel from '@/components/SpinWheel';

import {
    useBanca,
    useParticipants,
    BancaHeader,
    BancaStats,
    BancaHistory,
    BancaFooter,
    CloseBancaModal,
    ParticipantList,
    CreateBancaModal,
    AddParticipantModal,
    EditParticipantModal,
    DashboardActions,
} from '@/features/banca';

// Particles component - renders only on client to avoid hydration mismatch
function Particles() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const particles = useMemo(() => {
        if (!mounted) return [];
        return [...Array(20)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
        }));
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div className="particles-container">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        width: p.width,
                        height: p.height,
                        animationDelay: p.animationDelay,
                        animationDuration: p.animationDuration
                    }}
                />
            ))}
        </div>
    );
}

// Background component
function Background() {
    return (
        <>
            {/* Background Image */}
            <div
                className="fixed inset-0"
                style={{
                    zIndex: 0,
                    backgroundImage: 'url(/background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.6
                }}
            />
            {/* Vignette Overlay */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 1,
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.7) 100%)'
                }}
            />
        </>
    );
}

export default function KerbPage() {
    const {
        bancas,
        currentBanca,
        createBanca,
        closeBanca,
        reopenBanca,
        updateFinalBalance,
        updateCurrentBanca,
        clearCurrentBanca
    } = useBanca();

    const {
        participantForm,
        slotCalls,
        editingParticipant,
        setParticipantForm,
        addSlotCall,
        removeSlotCall,
        updateSlotCall,
        resetForm,
        addParticipant,
        startEditParticipant,
        updateParticipant,
        removeParticipant
    } = useParticipants();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showSpinWheel, setShowSpinWheel] = useState(false);
    const [chosenParticipants, setChosenParticipants] = useState<string[]>([]);

    const [localBanca, setLocalBanca] = useState(currentBanca);

    // Carrega chosenParticipants do localStorage ao montar
    useEffect(() => {
        const saved = localStorage.getItem('kerb_chosenParticipants');
        if (saved) {
            try {
                setChosenParticipants(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading chosen participants', e);
            }
        }
    }, []);

    // Salva chosenParticipants no localStorage
    useEffect(() => {
        if (chosenParticipants.length > 0) {
            localStorage.setItem('kerb_chosenParticipants', JSON.stringify(chosenParticipants));
        } else {
            localStorage.removeItem('kerb_chosenParticipants');
        }
    }, [chosenParticipants]);

    // Sincroniza localBanca com currentBanca do hook
    useEffect(() => {
        if (currentBanca && (!localBanca || localBanca.id !== currentBanca.id)) {
            setLocalBanca(currentBanca);
        }
    }, [currentBanca]);

    // Sincroniza mudanças de localBanca de volta para o hook (persiste no localStorage)
    useEffect(() => {
        if (localBanca) {
            updateCurrentBanca(localBanca);
        }
    }, [localBanca, updateCurrentBanca]);

    const handleCreateBanca = (title: string, description: string) => createBanca(title, description);

    const handleAddParticipant = () => {
        if (!localBanca) return;
        const updated = addParticipant(localBanca);
        if (updated) setLocalBanca(updated);
    };

    const handleEditParticipant = (participant: typeof editingParticipant) => {
        if (!participant) return;
        startEditParticipant(participant);
        setShowEditModal(true);
    };

    const handleUpdateParticipant = () => {
        if (!localBanca) return;
        const updated = updateParticipant(localBanca);
        if (updated) setLocalBanca(updated);
    };

    const handleRemoveParticipant = (participantId: string) => {
        if (!localBanca) return;
        const updated = removeParticipant(localBanca, participantId);
        setLocalBanca(updated);
    };

    const handleUpdateFinalBalance = (balance: number) => {
        if (!localBanca) return;
        setLocalBanca({ ...localBanca, finalBalance: balance });
        updateFinalBalance(balance);
    };

    const handleCloseBanca = (finalBalance: number) => {
        if (!localBanca) return;
        closeBanca(localBanca, finalBalance);
        setLocalBanca(null);
    };

    const handleBack = () => {
        clearCurrentBanca();
        setLocalBanca(null);
    };

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Background with Roman columns and cornucopia */}
            <Background />
            {/* Particles Animation - rendered client-side only to avoid hydration mismatch */}
            <Particles />
            <div className="relative py-8" style={{ zIndex: 10 }}>
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold gold-text mb-4">
                            BANCA DO KERB
                        </h1>
                    </motion.div>

                    {/* Main Content */}
                    {!localBanca ? (
                        <DashboardActions
                            onCreateBanca={() => setShowCreateModal(true)}
                            onShowHistory={() => setShowHistory(true)}
                        />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <BancaHeader
                                banca={localBanca}
                                onAddParticipant={() => setShowAddModal(true)}
                                onCloseBanca={() => setShowCloseModal(true)}
                                onBack={handleBack}
                                onUpdateFinalBalance={handleUpdateFinalBalance}
                            />

                            <BancaStats banca={localBanca} />

                            {/* Botão Roleta - só aparece com participantes */}
                            {localBanca.participants.length > 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center"
                                >
                                    <button
                                        onClick={() => setShowSpinWheel(true)}
                                        className="btn-gold py-3 px-8 rounded-xl text-lg font-bold flex items-center gap-3 hover:scale-105 transition-transform"
                                    >
                                        🎰 ROLETA DA CALL
                                    </button>
                                </motion.div>
                            )}

                            <ParticipantList
                                participants={localBanca.participants}
                                onEdit={handleEditParticipant}
                                onRemove={handleRemoveParticipant}
                                isLocked={localBanca.isLocked}
                            />
                        </motion.div>
                    )}

                    <BancaFooter />
                </div>
            </div>

            {/* Modais */}
            <CreateBancaModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateBanca}
            />

            <AddParticipantModal
                isOpen={showAddModal}
                onClose={() => { setShowAddModal(false); resetForm(); }}
                onSubmit={handleAddParticipant}
                participantForm={participantForm}
                setParticipantForm={setParticipantForm}
                slotCalls={slotCalls}
                onAddSlotCall={addSlotCall}
                onRemoveSlotCall={removeSlotCall}
                onUpdateSlotCall={updateSlotCall}
            />

            <EditParticipantModal
                isOpen={showEditModal}
                participant={editingParticipant}
                onClose={() => { setShowEditModal(false); resetForm(); }}
                onSubmit={handleUpdateParticipant}
                participantForm={participantForm}
                setParticipantForm={setParticipantForm}
                slotCalls={slotCalls}
                onAddSlotCall={addSlotCall}
                onRemoveSlotCall={removeSlotCall}
                onUpdateSlotCall={updateSlotCall}
            />

            <BancaHistory
                isOpen={showHistory}
                bancas={bancas}
                onClose={() => setShowHistory(false)}
                onReopen={reopenBanca}
            />

            <CloseBancaModal
                isOpen={showCloseModal}
                banca={localBanca}
                onClose={() => setShowCloseModal(false)}
                onConfirm={handleCloseBanca}
            />

            {/* YouTube Floating Player */}
            <YouTubeFloating />

            {/* Spin Wheel Modal */}
            <AnimatePresence>
                {showSpinWheel && localBanca && localBanca.participants.length > 1 && (
                    <SpinWheel
                        participants={localBanca.participants}
                        chosenParticipants={chosenParticipants}
                        setChosenParticipants={setChosenParticipants}
                        onClose={() => setShowSpinWheel(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
