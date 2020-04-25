import _config, { AppConfig, AppConfigWithEnv } from './config';

export type AppConfig = AppConfig;
export type AppConfigWithEnv = AppConfigWithEnv;

const config = _config[(process.env.NODE_ENV || 'production')] as AppConfig;

console.log('-----------config------------');

console.log({
    config,
    env: process.env.NODE_ENV
});

export default config;