import { BaseError } from "./base";

export class UserNotFoundError extends BaseError {
  constructor(field: string, fieldValue: string) {
    super(
      "UserNotFoundError",
      `User with ${field} '${fieldValue}' not found'`,
      404,
    );
  }
}
