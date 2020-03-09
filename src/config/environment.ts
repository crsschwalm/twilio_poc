/**
 * @todo: Update `.env.sample` file whenever `EnvVars` are updated.
 */
type EnvVars = Partial<{
  LEGACY_CONTENTFUL_ENVIRONMENT_ID: string;
  LEGACY_CONTENTFUL_MANAGEMENT_TOKEN: string;
  LEGACY_CONTENTFUL_SPACE_ID: string;

  CONTENTFUL_ENVIRONMENT_ID: string;
  CONTENTFUL_MANAGEMENT_TOKEN: string;
  CONTENTFUL_SPACE_ID: string;

  MIGRATION_FOLDER: string;
  MIGRATION_LAST_TIMESTAMP: string;

  NODE_ENV: string;
}>;

export default class Environment {
  constructor(private readonly config: EnvVars = process.env) {}

  get contentfulMigration() {
    return {
      accessToken: this.config.CONTENTFUL_MANAGEMENT_TOKEN,
      environmentId: this.config.CONTENTFUL_ENVIRONMENT_ID,
      spaceId: this.config.CONTENTFUL_SPACE_ID,

      folder: this.config.MIGRATION_FOLDER || `${process.cwd()}/migrations`,
      timestamp: this.config.MIGRATION_LAST_TIMESTAMP,
      confirm: false
    };
  }

  get legacyContentfulMigration() {
    return {
      accessToken: this.config.LEGACY_CONTENTFUL_MANAGEMENT_TOKEN,
      environmentId: this.config.LEGACY_CONTENTFUL_ENVIRONMENT_ID,
      spaceId: this.config.LEGACY_CONTENTFUL_SPACE_ID
    };
  }
}
