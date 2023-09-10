export interface AcquireRequest {
	id: string;
	waitTimeout?: number;
	mutexTimeout?: number;
}

export interface AcquireResponse {
	id: string;
}

export interface ReleaseRequest {
	id: string;
}

export interface MutexService {
	acquire(request: AcquireRequest): Promise<AcquireResponse>;
	release(request: ReleaseRequest): Promise<void>;
}
