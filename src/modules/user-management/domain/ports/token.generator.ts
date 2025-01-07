export interface TokenDTO {
  token: string;
  expiresIn: number;
}

export interface TokenGenerator {
  generate(id: string): TokenDTO;
}
