declare namespace NodeJS {
  export interface ProcessEnv {
    APP_PORT: number;
    APP_ENV: "development" | "production";
    APP_HOST: string;
  }
}
