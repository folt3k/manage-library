class HttpException extends Error {
  errorCode: number;

  constructor(errorCode: number, public readonly message: string = "") {
    super(message);
    this.errorCode = errorCode;

    if (!message) {
      this.message = this.getDefaultMessage();
    }
  }

  private getDefaultMessage(): string {
    switch (this.errorCode) {
      case 400:
        return "Niepoprawne żądanie";
      case 401:
        return "Musisz się zalogować, by mieć dostęp do tego zasobu.";
      case 403:
        return "Nie masz uprawnień do tego zasobu";
      case 404:
        return "Nie znaleziono takiego zasobu.";
      default:
        return "Wystąpił nieznany błąd";
    }
  }
}

export default HttpException;
