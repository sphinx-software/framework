import ValidatorManager from "./ValidatorManager";
import {provider} from "../Fusion";
import {SerializerInterface} from "../ServiceContracts";
import FormValidationResult from "./Form/FormValidationResult";

@provider()
export default class ValidatorServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(ValidatorManager, async () => {
            return new ValidatorManager();
        });

        this.container.made(ValidatorManager, async (manager) => {
            let validatorClasses = this.fusion.getByManifest('validation.validator');

            for (let index = 0; index < validatorClasses.length; index++) {
                let Validator       = validatorClasses[index];
                let validatorName   = Reflect.getMetadata('validation.validator', Validator);
                let validator       = await this.container.make(Validator);

                manager.add(validatorName, validator);
            }
        });

        let formClasses = this.fusion.getByManifest('validation.form');

        formClasses.forEach(Form => {
            this.container.made(Form, async form => {
                let manager = await this.container.make(ValidatorManager);
                form.setManager(manager).setRulesDefinition(Reflect.getMetadata('validation.form', Form));
                return form;
            });
        });

        this.container.made(SerializerInterface, async serializer => {
            //
            // Register the validation result to the serializer
            // So the session can know how to flash the result
            serializer.forType(
                FormValidationResult,
                validationResult => validationResult.toJson(),
                rawResult => new FormValidationResult(rawResult)
            );

            return serializer;
        })
    }
}
