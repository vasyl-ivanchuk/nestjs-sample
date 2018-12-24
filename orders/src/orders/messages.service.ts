import { Injectable } from '@nestjs/common';
import { ClientProxy, Client, ClientOptions } from '@nestjs/microservices';
import config from '../config';

@Injectable()
export class MessagesService {
    @Client(<ClientOptions>config.microservicesConfiguration)
    private client: ClientProxy;

    async onModuleInit() {
        await this.client.connect();
    }

    async publish(name: string, data: any) {
        await this.client.send<string>({ cmd: name }, data).toPromise();
    }
}