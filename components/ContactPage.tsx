import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [submitError, setSubmitError] = useState<string | null>(null);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const formDataObj = new FormData();

            // Requires VITE_WEB3FORMS_ACCESS_KEY in .env.local
            const accessKey = (import.meta as any).env.VITE_WEB3FORMS_ACCESS_KEY as string;

            if (!accessKey) {
                throw new Error("Missing Web3Forms Access Key. Please configure VITE_WEB3FORMS_ACCESS_KEY.");
            }

            formDataObj.append('access_key', accessKey);
            formDataObj.append('name', formData.name);
            formDataObj.append('email', formData.email);
            formDataObj.append('subject', formData.subject);
            formDataObj.append('message', formData.message);

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formDataObj
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                // Reset success message after 5 seconds
                setTimeout(() => {
                    setIsSuccess(false);
                }, 5000);
            } else {
                setSubmitError(data.message || "Failed to send message. Please try again.");
                console.error("Web3Forms Error:", data);
            }
        } catch (error) {
            console.error(error);
            setSubmitError("Network error occurred. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Left Column - Contact Info */}
                <motion.div
                    className="lg:col-span-2 space-y-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={item}>
                        <GlassCard className="h-full bg-indigo-500/5 border-indigo-500/20">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-widest mb-2">Support Directives</h3>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                                Experiencing anomalies in the financial matrix? Need to recalibrate your account settings? Our system architects are on standby to assist you.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-xl text-slate-400 mt-1">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Channel</p>
                                        <p className="text-sm font-bold text-white">support@smartspend.ai</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-xl text-slate-400 mt-1">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Grid Coordinates</p>
                                        <p className="text-sm font-bold text-white">128 Cyber Avenue<br />Sector 7G, Neo-Tokyo</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-xl text-slate-400 mt-1">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Response Time</p>
                                        <p className="text-sm font-bold text-white">&lt; 24 System Cycles</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </motion.div>

                {/* Right Column - Contact Form */}
                <motion.div
                    className="lg:col-span-3"
                    variants={item}
                    initial="hidden"
                    animate="show"
                >
                    <GlassCard className="h-full">
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Message Us</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-8">Transmit direct message to us</p>

                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center"
                            >
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h4 className="text-xl font-black text-white tracking-widest uppercase italic mb-2">Transmission Successful</h4>
                                <p className="text-emerald-400/80 text-sm font-semibold">Your message has been securely relayed. Expect a response shortly.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {submitError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3"
                                    >
                                        <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-sm font-semibold text-rose-400">{submitError}</p>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                            placeholder="Enter your designation"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Your Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                            placeholder="you@matrix.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Subject Matter</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                        placeholder="Brief description of the anomaly"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Transmission Data</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-semibold resize-none"
                                        placeholder="Elaborate on the details..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-indigo-600/30 uppercase tracking-widest italic flex items-center justify-center gap-3 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Encrypting & Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Transmit Message</span>
                                            <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </GlassCard>
                </motion.div>

            </div>
        </div>
    );
};

export default ContactPage;
