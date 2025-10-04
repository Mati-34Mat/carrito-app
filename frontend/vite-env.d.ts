interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_API_PORT: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}