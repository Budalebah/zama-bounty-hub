"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Calculator, Scale, ShieldCheck, Key, Coins, Gavel, Vote, Download, Terminal, Play, Copy, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FHEPlayground } from "@/components/FHEPlayground";
import { toast } from "sonner";

const templates = [
  { id: 'fhevm-example-encrypted-value', title: 'Encrypted Value', description: 'Store and retrieve encrypted integers.', complexity: 'Basic', icon: Lock, templateName: 'EncryptedValue' },
  { id: 'fhevm-example-arithmetic', title: 'FHE Arithmetic', description: 'Perform encrypted addition and subtraction.', complexity: 'Basic', icon: Calculator, templateName: 'FHEArithmetic' },
  { id: 'fhevm-example-equality', title: 'FHE Equality', description: 'Check if two encrypted values are equal.', complexity: 'Basic', icon: Scale, templateName: 'FHEEquality' },
  { id: 'fhevm-example-access-control', title: 'Access Control', description: 'Manage permissions with FHE.allow.', complexity: 'Security', icon: ShieldCheck, templateName: 'FHEAccessControl' },
  { id: 'fhevm-example-anti-patterns', title: 'Anti-Patterns', description: 'Common mistakes and how to avoid them.', complexity: 'Security', icon: AlertTriangle, templateName: 'FHEAntiPatterns' },
  { id: 'fhevm-example-reencryption', title: 'User Decryption', description: 'Users decrypt their own data (Re-encryption).', complexity: 'Decryption', icon: Key, templateName: 'FHEReencryption' },
  { id: 'fhevm-example-erc20', title: 'Confidential ERC20', description: 'Token with encrypted balances and transfers.', complexity: 'Advanced', icon: Coins, templateName: 'FHEERC20' },
  { id: 'fhevm-example-blind-auction', title: 'Blind Auction', description: 'Highest bid is secret until the end.', complexity: 'Advanced', icon: Gavel, templateName: 'FHEBlindAuction' },
  { id: 'fhevm-example-voting', title: 'Confidential Voting', description: 'Encrypted vote aggregation.', complexity: 'Advanced', icon: Vote, templateName: 'FHEVoting' },
];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyCommand = (templateName: string) => {
    const command = `# Clone the Zama FHEVM Example Hub
git clone https://github.com/Budalebah/zama-bounty-hub.git
cd zama-bounty-hub/automation
npm install

# Generate your project
npx ts-node src/create-fhevm-example.ts my-${templateName.toLowerCase()} --template ${templateName}`;

    navigator.clipboard.writeText(command);
    toast.success("Full setup commands copied!", {
      description: `Includes repo clone and project generation.`,
      icon: <Terminal className="w-4 h-4" />,
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-primary selection:text-primary-foreground">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            Zama FHEVM <span className="text-primary">Playground</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Build confidential dApps in seconds. Explore templates, simulate FHE logic, and download ready-to-deploy projects.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2 shadow-[0_0_20px_-5px_rgba(255,215,0,0.5)]" onClick={() => scrollToSection('templates')}>
              <Terminal className="w-4 h-4" /> Start Building
            </Button>
            <Button size="lg" variant="outline" className="gap-2" onClick={() => scrollToSection('simulation')}>
              <Play className="w-4 h-4" /> Try Simulation
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Templates Grid */}
      <section id="templates" className="px-4 pb-32 max-w-7xl mx-auto z-10 relative scroll-mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Templates</h2>
          <Button variant="ghost" className="text-muted-foreground hover:text-white">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(template.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className={`h-full border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 ${hoveredCard === template.id ? 'border-primary/50 shadow-[0_0_30px_-10px_rgba(255,215,0,0.3)] -translate-y-1' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded-lg bg-white/5 transition-colors duration-300 ${hoveredCard === template.id ? 'text-primary bg-primary/10' : 'text-white'}`}>
                      <template.icon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10">
                      {template.complexity}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Code Snippet Preview (Fake) */}
                  <div className="bg-black/50 p-3 rounded-md font-mono text-xs text-muted-foreground overflow-hidden h-24 relative border border-white/5">
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/90 to-transparent" />
                    <p className="text-purple-400">contract</p>
                    <p className="pl-2 text-yellow-200">{template.title.replace(/\s/g, '')} <span className="text-white">is</span> ZamaConfig {'{'}</p>
                    <p className="pl-4 text-blue-400">euint32 <span className="text-white">private</span> secureData;</p>
                    <p className="pl-4 text-purple-400">function <span className="text-yellow-200">action</span>() <span className="text-white">public</span> {'{'}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full gap-2"
                    variant={hoveredCard === template.id ? "default" : "outline"}
                    onClick={() => handleCopyCommand(template.templateName)}
                  >
                    <Copy className="w-4 h-4" /> Copy Command
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simulation Section */}
      <section id="simulation" className="px-4 pb-32 max-w-4xl mx-auto z-10 relative scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Understand the Magic</h2>
          <p className="text-muted-foreground">
            Fully Homomorphic Encryption allows you to perform computations on encrypted data without decrypting it first.
          </p>
        </div>
        <FHEPlayground />
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-white/5">
        <p>Built by <a href="https://x.com/budavlebac1" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">HALO</a></p>
      </footer>
    </main>
  );
}
