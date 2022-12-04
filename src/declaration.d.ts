declare module "*.module.css";
declare module "*.svg";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string;
    }
  }
}
