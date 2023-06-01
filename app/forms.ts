export enum FormIntent {
  UpdateEmail = 'updateEmail',
  UpdateDetails = 'updateDetails',
}

export type FormError = {
  message: string;
  intent?: string;
};