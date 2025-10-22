export const IMAGE_TYPES = {
  USER_PROFILE: 'UserProfile',
  POKEMON_PROFILE: 'PokemonProfile',
  CUSTOM_TYPE: 'CustomType',
  CUSTOM_TYPE_TCG: 'CustomTypeTCG',
  CARD_TCG: 'CardTCG',
  OTHER: 'Other'
} as const;

export type ImageType = typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES];
