export interface AcquireRequest {
	id: string;
	waitTimeout?: number;
	mutexTimeout?: number;
	attempts?: number;
}

export interface MutexService {
	acquire(request: AcquireRequest): Promise<() => Promise<void>>;
}
