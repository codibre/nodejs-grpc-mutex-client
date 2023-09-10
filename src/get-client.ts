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
import { AcquireResponse, MutexService } from './models';

const DEFAULT_WAIT_TIMEOUT = 15000;

export function getClient(address: string, ssl = false): MutexService {
	const proto = loadSync(join(process.cwd(), '/proto/mutex.proto'));
	const definition = loadPackageDefinition(proto);
	const client = new (definition as any).codibre.Mutex.MutexService(
		'0.0.0.0:3000',
		ssl ? ChannelCredentials.createSsl() : ChannelCredentials.createInsecure(),
	);
	const acquire = client.acquire.bind(client);
	const release = client.release.bind(client);

	return {
		acquire(request): Promise<AcquireResponse> {
			return acquire(request, {
				deadline: Date.now() + (request.mutexTimeout ?? DEFAULT_WAIT_TIMEOUT),
			} as Partial<CallOptions>);
		},
		release(request): Promise<void> {
			return release(request);
		},
	};
}
