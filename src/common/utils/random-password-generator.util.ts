export const generateRandomPassword = (): string => Math.random().toString(36).slice(-8);
