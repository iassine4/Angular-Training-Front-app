export const environment = {
  production: false,
  // ↑ false = mode développement (logs, erreurs détaillées, config dev)
  //   En production, ce sera généralement true.

  cryptoKeyBase64: 'kTJOqcYmmNAhbq0q5jYbbSrs1Yc4n8BfmVtiYcs/91Q=',
  // ↑ Ici la clé en Base64 qui représente 32 bytes (32 octets).
  //   Base64 = une façon d'écrire des données "binaires" sous forme de texte.
  //   Cette clé sert de secret pour une logique "crypto" dans l'app (selon implémentation).
};
