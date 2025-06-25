import { cpf, cnpj } from 'cpf-cnpj-validator';
import { IsDocumentValidator } from './is-document.validator';
import { ValidationArguments } from 'class-validator';

describe('CpfCnpjValidator', () => {
  const validator = new IsDocumentValidator();
  const mockValidationArguments = {} as ValidationArguments;

  it('deve validar CPF correto (11 dígitos)', () => {
    const validCpf = cpf.generate(); 
    expect(validator.validate(validCpf, mockValidationArguments)).toBe(true);
  });

  it('deve validar CNPJ correto (14 dígitos)', () => {
    const validCnpj = cnpj.generate(); 
    expect(validator.validate(validCnpj, mockValidationArguments)).toBe(true);
  });

  it('deve invalidar números com tamanho incorreto', () => {
    expect(validator.validate('1234567890', mockValidationArguments)).toBe(false); 
    expect(validator.validate('123456789012', mockValidationArguments)).toBe(false);
  });

  it('deve invalidar números falsos', () => {
    expect(validator.validate('11111111111', mockValidationArguments)).toBe(false);
    expect(validator.validate('00000000000000', mockValidationArguments)).toBe(false);
  });
});
