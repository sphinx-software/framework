import ValidatorManager from "./ValidatorManager";
import {provider} from "../Fusion/Fusion";

@provider()
export default class ValidatorServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        let manager = new ValidatorManager();

        this.container.value(ValidatorManager, manager);

        let formClasses = this.fusion.getByManifest('validation.form');

        formClasses.forEach(Form => {
            this.container.made(Form.name, form => {
                form.setManager(manager).setRulesDefinition(Reflect.getMetadata('validation.form', Form));
            });
        })
    }

    async boot() {
        let manager          = await this.container.make(ValidatorManager);
        let validatorClasses = this.fusion.getByManifest('validation.validator');

        for (let index = 0; index < validatorClasses.length; index++) {
            let Validator = validatorClasses[index];
            let validatorName = Reflect.getMetadata('validation.validator', Validator);
            let validator = await this.container.make(Validator);

            manager.add(validatorName, validator);
        }
    }
}
