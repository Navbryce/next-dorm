import {DefinePlugin} from 'webpack';

const {required} = require('dotenv-safe').config();

export default (config, env, helpers, params = defaultParams) => {
    config.resolve.alias.src = env.src;
    // dotenv injection
    config.plugins.push(new DefinePlugin(
        Object.keys(required).reduce(
            (env, key) => ({
                ...env,
                [`process.env.${key}`]: JSON.stringify(required[key]),
            }),
            {}
        ))
    );
}
