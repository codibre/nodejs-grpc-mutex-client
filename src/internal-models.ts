import { CallOptions } from '@grpc/grpc-js';
import { AcquireRequest } from './models';

export interface AcquireResponse {
	id: string;
}

export interface ReleaseRequest {
	id: string;
}

export interface MutexApiGrpcClient {
	acquire(
		request: AcquireRequest,
		options: CallOptions,
	): Promise<AcquireResponse>;
	release(request: ReleaseRequest): Promise<{}>;
}
