declare namespace Cypress {
  interface Chainable {
    typeLogin: (email: string, password: string) => void;
    getByLabel: (label: string) => Chainable<JQuery<HTMLElement>>;
  }
}
