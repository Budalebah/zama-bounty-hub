"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FHEPlayground() {
    const [input, setInput] = useState<number>(0);
    const [encrypted, setEncrypted] = useState<boolean>(false);
    const [operations, setOperations] = useState<number[]>([]);
    const [decryptedResult, setDecryptedResult] = useState<number | null>(null);

    const handleEncrypt = () => {
        setEncrypted(true);
        setDecryptedResult(null);
    };

    const handleAdd = (val: number) => {
        setOperations([...operations, val]);
        setDecryptedResult(null);
    };

    const handleDecrypt = () => {
        const sum = input + operations.reduce((a, b) => a + b, 0);
        setDecryptedResult(sum);
    };

    const handleReset = () => {
        setInput(0);
        setEncrypted(false);
        setOperations([]);
        setDecryptedResult(null);
    };

    // Helper to generate a deterministic "fake" hash based on the value
    // so it looks like a real ciphertext but is consistent
    const getFakeHash = (val: number) => {
        const hash = Math.abs(Math.sin(val + 1) * 10000).toString(16).substring(2, 8);
        return `0x${hash}...`;
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-black/40 border-white/10 backdrop-blur-md p-8">
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-primary">FHE Simulator</h3>
                    <Button variant="ghost" size="sm" onClick={handleReset}><RefreshCw className="w-4 h-4" /></Button>
                </div>

                {/* Stage 1: Input */}
                <div className="flex items-center gap-4">
                    <div className="w-24 text-sm text-muted-foreground">1. Input</div>
                    <input
                        type="number"
                        value={input}
                        onChange={(e) => setInput(Number(e.target.value))}
                        disabled={encrypted}
                        className="bg-white/5 border border-white/10 rounded px-3 py-2 w-24 text-center disabled:opacity-50 text-white"
                    />
                    {!encrypted && (
                        <Button onClick={handleEncrypt} className="gap-2">
                            <Lock className="w-4 h-4" /> Encrypt
                        </Button>
                    )}
                </div>

                {/* Stage 2: Encrypted State */}
                <AnimatePresence>
                    {encrypted && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-24 text-sm text-muted-foreground">2. Compute</div>
                            <div className="flex items-center gap-2 bg-white/5 p-4 rounded-lg border border-white/10 flex-1 overflow-x-auto">
                                <div className="flex items-center gap-2 text-yellow-500 font-mono text-sm" title={`Encrypted value of ${input}`}>
                                    <Lock className="w-4 h-4" />
                                    <span>{getFakeHash(input)}</span>
                                </div>

                                {operations.map((op, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4 text-muted-foreground" />
                                        <div className="flex items-center gap-2 text-yellow-500 font-mono text-sm" title={`Encrypted value of ${op}`}>
                                            <Lock className="w-4 h-4" />
                                            <span>{getFakeHash(op)}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleAdd(5)}>+ 5</Button>
                                <Button size="sm" variant="outline" onClick={() => handleAdd(10)}>+ 10</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stage 3: Decrypt */}
                <AnimatePresence>
                    {encrypted && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-24 text-sm text-muted-foreground">3. Result</div>
                            {decryptedResult === null ? (
                                <Button onClick={handleDecrypt} className="gap-2" variant="secondary">
                                    <Unlock className="w-4 h-4" /> Decrypt Result
                                </Button>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl font-bold text-primary"
                                >
                                    {decryptedResult}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
}
