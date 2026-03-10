export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export async function withServiceError<T>(
  context: string,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ServiceError) throw error;

    const detail =
      error instanceof Error ? error.message : "An unexpected error occurred";

    throw new ServiceError(`${context}: ${detail}`, error);
  }
}
