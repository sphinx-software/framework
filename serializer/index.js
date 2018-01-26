import Serializer from 'serializer';
import {provider} from "../Fusion/Fusion";


@provider()
export class SerializerProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion = fusion;
    }

    register() {
        this.container.singleton('serializer', async () => {
            return new Serializer()
                .forType(Object, item => item, data => data)
                .useDefault(Object);
        })
    }

}