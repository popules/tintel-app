"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/locales/en';
import { sv } from '@/locales/sv';
import { createClient } from '@/lib/supabase/client';

type Locale = 'en' | 'sv';
type Dictionary = typeof en;

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Dictionary;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('sv');
    const supabase = createClient();

    useEffect(() => {
        // 1. Check persistence
        const saved = localStorage.getItem('tintel-locale') as Locale;
        if (saved && (saved === 'en' || saved === 'sv')) {
            setLocaleState(saved);
        }

        // 2. If logged in, fetch preference from DB
        const syncWithDb = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('preferred_language')
                    .eq('id', session.user.id)
                    .single();

                if (data?.preferred_language && (data.preferred_language === 'en' || data.preferred_language === 'sv')) {
                    setLocaleState(data.preferred_language as Locale);
                    localStorage.setItem('tintel-locale', data.preferred_language);
                }
            }
        };
        syncWithDb();
    }, []);

    const setLocale = async (l: Locale) => {
        setLocaleState(l);
        localStorage.setItem('tintel-locale', l);
        document.documentElement.lang = l;

        // Sync to DB if logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await supabase
                .from('profiles')
                .update({ preferred_language: l })
                .eq('id', session.user.id);
        }
    };

    const t = locale === 'sv' ? sv : en;

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
}
