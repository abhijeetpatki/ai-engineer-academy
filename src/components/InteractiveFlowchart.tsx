import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Sparkles, ArrowRight, ShieldCheck, Cpu, Search, CheckCircle2, Layers } from 'lucide-react';
import { InteractiveFlowchartSpec, FlowchartNode } from '../types/academy';

interface Props {
  spec: InteractiveFlowchartSpec;
}

const CATEGORY_STYLES: Record<FlowchartNode['category'], { badge: string; border: string; bg: string }> = {
  input: {
    badge: 'bg-[#F5EBE6] text-[#9E4758] border-[#E8A598]',
    border: 'border-[#E8A598]',
    bg: 'bg-[#FAF7F2]'
  },
  process: {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    border: 'border-amber-300',
    bg: 'bg-amber-50/40'
  },
  model: {
    badge: 'bg-[#9E4758]/10 text-[#9E4758] border-[#9E4758]/30',
    border: 'border-[#9E4758]',
    bg: 'bg-[#FDF6F4]'
  },
  eval: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50/40'
  },
  guardrail: {
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
    border: 'border-purple-300',
    bg: 'bg-purple-50/40'
  },
  output: {
    badge: 'bg-sky-50 text-sky-800 border-sky-200',
    border: 'border-sky-300',
    bg: 'bg-sky-50/40'
  }
};

export const InteractiveFlowchart: React.FC<Props> = ({ spec }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  useEffect(() => {
    setSelectedIndex(0);
    setIsAutoPlaying(false);
  }, [spec.id]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % spec.nodes.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isAutoPlaying, spec.nodes.length]);

  const activeNode = spec.nodes[selectedIndex] || spec.nodes[0];
  const style = CATEGORY_STYLES[activeNode.category];

  return (
    <div className="rounded-2xl border border-[#E8A598]/40 bg-[#FAF7F2] p-5 md:p-6 shadow-editorial">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758]/10 text-[#9E4758] text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            Interactive Architecture Flowchart
          </div>
          <h3 className="text-xl font-bold text-[#1E293B] font-editorial">{spec.title}</h3>
          <p className="text-sm text-[#64748B] mt-0.5">{spec.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAutoPlaying((p) => !p)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all self-start ${
            isAutoPlaying
              ? 'bg-[#9E4758] text-white shadow-sm'
              : 'bg-white text-[#9E4758] border border-[#E8A598] hover:bg-[#F5EBE6]'
          }`}
        >
          {isAutoPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause Pipeline Trace
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Simulate Pipeline Flow
            </>
          )}
        </button>
      </div>

      {/* Interactive Node Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:items-stretch gap-3 mb-6">
        {spec.nodes.map((node, index) => {
          const isSelected = index === selectedIndex;
          const isPassed = index < selectedIndex;

          return (
            <React.Fragment key={node.id}>
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setSelectedIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`flex-1 text-left p-3.5 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-2 border-[#9E4758] shadow-md ring-4 ring-[#E8A598]/20'
                    : isPassed
                    ? 'bg-white/90 border-[#E8A598]/60 hover:border-[#9E4758]'
                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-[#E8A598]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId={`active-bar-${spec.id}`}
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8A598] via-[#9E4758] to-[#E8A598]"
                  />
                )}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono uppercase font-semibold text-[#9E4758]">
                    Step {index + 1}/{spec.nodes.length}
                  </span>
                  {isSelected && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-[#9E4758] animate-ping" />
                  )}
                </div>
                <div className="font-bold text-sm text-[#1E293B] leading-snug">{node.label}</div>
                <div className="text-xs text-[#64748B] mt-1 font-mono truncate">{node.sublabel}</div>
              </motion.button>

              {index < spec.nodes.length - 1 && (
                <div className="hidden xl:flex items-center justify-center text-[#D48C84]">
                  <ArrowRight className={`w-4 h-4 ${index < selectedIndex ? 'text-[#9E4758]' : ' opacity-50'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Node Deep Inspection Drawer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl border ${style.border} bg-white p-5`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>
                {activeNode.category.toUpperCase()} STAGE
              </span>
              <h4 className="text-base font-bold text-[#1E293B]">{activeNode.label}</h4>
              <span className="text-xs font-mono text-[#64748B] bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-slate-200">
                {activeNode.sublabel}
              </span>
            </div>
            {activeNode.metrics && (
              <div className="text-xs font-mono font-medium text-[#9E4758] bg-[#FDF6F4] px-3 py-1 rounded-lg border border-[#E8A598]/40">
                ⚡ {activeNode.metrics}
              </div>
            )}
          </div>

          <p className="text-sm text-[#1E293B] leading-relaxed mb-4">{activeNode.description}</p>

          <div className="rounded-lg bg-[#FAF7F2] border-l-4 border-[#9E4758] p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#9E4758] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758] mb-0.5">
                QA-to-AI Engineer Verification Insight
              </div>
              <p className="text-xs sm:text-sm text-[#1E293B]">{activeNode.qaTakeaway}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
