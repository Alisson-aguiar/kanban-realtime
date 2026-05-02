import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Data não disponível';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // Verificar se a data é válida
        if (isNaN(dateObj.getTime())) {
            return 'Data inválida';
        }

        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(dateObj);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Data inválida';
    }
};