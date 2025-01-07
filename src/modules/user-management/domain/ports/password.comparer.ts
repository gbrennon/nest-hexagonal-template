export interface PasswordComparerDTO {
  plainTextPassword: string,
  encryptedPassword: string
}

export interface PasswordComparer {
  compare(input: PasswordComparerDTO): Promise<boolean>;
}
