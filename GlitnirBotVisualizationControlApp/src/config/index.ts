import _config, { AppConfig as AppConfig_, AppConfigWithEnv as AppConfigWithEnv_ } from './config';

export type AppConfig = AppConfig_;
export type AppConfigWithEnv = AppConfigWithEnv_;

let env = process.env.NODE_ENV;
if (env === 'test') {
    env = 'production';
}

const config = _config[(env || 'production')] as AppConfig;

console.log('-----------config------------');

console.log({
    _config,
    config,
    processEnv: process.env.NODE_ENV,
    env
});

export default config;