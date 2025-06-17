export const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return false;

  // List of allowed origins
  const allowedOrigins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "null", // For local file access
  ];

  return allowedOrigins.includes(origin);
};
