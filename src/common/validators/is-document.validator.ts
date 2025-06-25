import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isDocument', async: false })
export class IsDocumentValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return cpf.isValid(text) || cnpj.isValid(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Documento inválido. Deve ser CPF ou CNPJ válido.';
  }
}
