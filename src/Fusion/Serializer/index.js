import Serializer   from './Serializer';
import { provider } from '../Fusion';
import {SerializerInterface} from "../ServiceContracts";

@provider()
export class SerializerProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(SerializerInterface, async () => {
            return new Serializer().forType(Object, item => item, data => data).
                useDefault(Object);
        });
    }
}
