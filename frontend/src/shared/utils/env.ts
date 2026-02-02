export const getEnv = (key: string): string => {
  if (typeof window !== "undefined" && (window as any).ENV) {
    return (window as any).ENV[key];
  }
  return process.env[key] || "";
};
