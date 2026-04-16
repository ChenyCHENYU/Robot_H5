export type FormFieldType =
    | 'text'
    | 'password'
    | 'number'
    | 'digit'
    | 'textarea'
    | 'select'
    | 'switch'
    | 'checkbox'
    | 'radio';

export interface SelectOption {
    text: string;
    value: string | number;
}

export type FieldValidator = (
    value: unknown,
    rule: FormFieldRule,
) => boolean | string | Promise<boolean | string>;

export interface FormFieldRule {
    required?: boolean;
    message?: string;
    pattern?: RegExp;
    min?: number;
    max?: number;
    validator?: FieldValidator;
    trigger?: 'onChange' | 'onBlur';
}

export interface FormField {
    key: string;
    label: string;
    type?: FormFieldType;
    placeholder?: string;
    required?: boolean;
    rules?: FormFieldRule[];
    options?: SelectOption[];
    disabled?: boolean;
    readonly?: boolean;
    maxlength?: number;
    showWordLimit?: boolean;
    rows?: number;
    extra?: string;
    prefixIcon?: string;
    fieldClass?: string;
    visible?: boolean | ((values: Record<string, any>) => boolean);
}

export type FormValues = Record<string, any>;

export interface CFormInstance {
    validate: () => Promise<void>;
    resetValidation: () => void;
    resetFields: () => void;
    getValues: () => FormValues;
}
