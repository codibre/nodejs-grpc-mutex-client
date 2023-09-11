/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	CallOptions,
	ChannelCredentials,
	loadPackageDefinition,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { join } from 'path';
import { AcquireRequest, MutexService } from './models';
import { MutexApiGrpcClient } from './internal-models';

const DEFAULT_WAIT_TIMEOUT = 15000;

export class MutexAPIClient implements MutexService {
	private client: MutexApiGrpcClient;

	constructor(
		private address: string,
		private ssl = false,
	) {
		const proto = loadSync(join(process.cwd(), '/proto/mutex.proto'));
		const definition = loadPackageDefinition(proto);
		this.client = new (definition as any).codibre.Mutex.MutexService(
			this.address,
			this.ssl
				? ChannelCredentials.createSsl()
				: ChannelCredentials.createInsecure(),
		);
	}

	async acquire(request: AcquireRequest): Promise<() => Promise<void>> {
		const deadline =
			Date.now() +
			((request.mutexTimeout ?? DEFAULT_WAIT_TIMEOUT) + DEFAULT_WAIT_TIMEOUT);
		const options: CallOptions = {
			deadline,
		};
		let attempts = Math.max(request.attempts ?? 1, 1);
		let error: unknown;
		while (attempts > 0) {
			try {
				const response = await this.client.acquire(request, options);
				return async () => {
					await this.client.release(response);
				};
			} catch (err) {
				attempts--;
				error = err;
			}
		}
		throw error;
	}
}
