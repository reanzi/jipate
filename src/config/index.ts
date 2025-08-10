
import type { Role } from '@/types';
import { User, Shield, Trophy, DollarSign, type LucideIcon } from 'lucide-react';
export const roles: {
    name: string;
    type: Role;
    icon: LucideIcon;
    description: string;
    colorClass: string;
    bgClass: string;
    borderClass?: string
}[] = [
        {
            name: 'Mpiga kura',
            type: 'voter',
            icon: User,
            description: 'Default user with voting privileges',
            colorClass: '',
            bgClass: '',
            borderClass: ''
        },
        {
            name: 'Wakala',
            type: 'agent',
            icon: Shield,
            description: 'Facilitates processes and manages operations',
            colorClass: 'dark:text-blue-400 text-blue-600',
            bgClass: 'dark:bg-blue-400/10 bg-blue-50',
            borderClass: 'dark:border-blue-400/30 border-blue-200'
        },
        {
            name: 'Mgombea',
            type: 'contender',
            icon: Trophy,
            description: 'Competing for position or recognition',
            colorClass: 'dark:text-orange-400 text-orange-600',
            bgClass: 'dark:bg-orange-400/10 bg-orange-50',
            borderClass: 'dark:border-orange-400/30 border-orange-200'
        },
        {
            name: 'Mdhamini',
            type: 'sponsor',
            icon: DollarSign,
            description: 'Provides financial or resource support',
            colorClass: 'dark:text-emerald-400 text-emerald-600',
            bgClass: 'dark:bg-emerald-400/10 bg-emerald-50',
            borderClass: 'dark:border-emerald-400/30 border-emerald-200'
        }
    ];