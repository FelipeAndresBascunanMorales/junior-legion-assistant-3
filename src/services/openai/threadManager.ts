export class ThreadManager {
  private static instance: ThreadManager;
  private threadId: string | null = null;

  private constructor() {}

  public static getInstance(): ThreadManager {
    if (!ThreadManager.instance) {
      ThreadManager.instance = new ThreadManager();
    }
    return ThreadManager.instance;
  }

  public setThreadId(id: string) {
    this.threadId = id;
  }

  public getThreadId(): string | null {
    return this.threadId;
  }

  public clearThreadId() {
    this.threadId = null;
  }
}