// Footer KERB

'use client';

import { motion } from 'framer-motion';

export default function BancaFooter() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="fixed bottom-0 left-0 right-0 py-4 border-t border-yellow-500/20 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 20 }}
        >
            <div className="text-center text-yellow-100/40 text-sm space-y-1">
                <p>
                    © 2024 <span className="gold-text font-semibold">BANCA DO KERB</span>
                </p>
                <p>
                    Desenvolvido por{' '}
                    <a
                        href="https://wa.me/5511917163488"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gold-text font-semibold hover:text-yellow-300 transition-colors"
                    >
                        Floriani
                    </a>
                </p>
            </div>
        </motion.footer>
    );
}
