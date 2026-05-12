// Cypress support file for project-wide E2E setup.

Cypress.Commands.add("seleccionarNumeros", (numeros) => {
  numeros.forEach((numero) => {
    cy.contains("button", new RegExp(`^${numero}$`)).click();
  });
});

Cypress.Commands.add("iniciarPartidaOoodle", (jugador, dificultad = "normal") => {
  cy.get('input[placeholder="Ej. Ada"]').clear().type(jugador);

  if (dificultad === "dificil") {
    cy.contains("button", "Dificil").click();
  }

  cy.contains("button", "Iniciar juego").click();
  cy.wait("@iniciarJuego");
});
