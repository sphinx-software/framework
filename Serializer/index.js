import Serializer   from './Serializer';
import { provider } from '../Fusion/Fusion';
import {SerializerInterface} from "../Fusion/ServiceContracts";

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
