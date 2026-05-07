"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DificultadNormal = void 0;
class DificultadNormal {
    generarNumeros() {
        const rangoMinimo = 1;
        const rangoMaximo = 9;
        const disponibles = Array.from({ length: rangoMaximo - rangoMinimo + 1 }, (_, i) => i + rangoMinimo);
        for (let i = disponibles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [disponibles[i], disponibles[j]] = [disponibles[j], disponibles[i]];
        }
        return disponibles.slice(0, 4);
    }
    calcularIntentosMaximos() {
        return 6;
    }
    calcularPuntaje(intentosJugador) {
        const intentosMaximos = this.calcularIntentosMaximos();
        const intentosRestantes = Math.max(intentosMaximos - intentosJugador, 0);
        return 100 + intentosRestantes * 50;
    }
}
exports.DificultadNormal = DificultadNormal;
