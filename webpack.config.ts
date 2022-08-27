import {generateConfiguration} from './webpack/webpack-util';
import {WebpackOptionsNormalized, DefinePlugin} from 'webpack';
import path from 'path';
import HtmlPlugin from 'html-webpack-plugin';

// 注意：__dirname为本文件所在目录
export default (
    env: Record<string, unknown>, // 环境变量
    argv: { // 命令行参数
        mode?: 'production', // 模式
        config: Array<string>, // 配置文件
        env: Record<string, unknown>, // 环境变量
    },
) => {
    const config = generateConfiguration(
        argv.mode === 'production' ? 'prod' : 'dev', { // 从argv中读入，非production都是dev
            dir: __dirname,
            ts: './src/index.tsx',
            scss: './src/index.scss',
        }, {
            dir: 'www',
            js: `dist/[name].${getBuildTimeStr()}[contenthash:6].bundle.js`,
        }, {rules: []}
    );
    return {
        ...config,
        devServer: {
            hot: true,
            host: '0.0.0.0',
            compress: true,
            port: 9000,
            headers: {'Access-Control-Allow-Origin': '*'},
            open: true,
            historyApiFallback: true,
            proxy: {
                '/jeecg-system': {
                    target: 'http://www.pifutan.com:9999',
                    secure: false,
                    changeOrigin: true,
                },
            },
        },
        plugins: (config.plugins ?? []).concat([
            new HtmlPlugin({
                title: 'bbs',
                filename: 'index.html',
                template: path.resolve(process.cwd(), 'public/index.html'),
                inject: 'body',
                hash: true,
                minify: {
                    removeComments: true,
                },
                favicon: path.resolve(process.cwd(), 'public/favicon.png'),
                env: process.env,
            }),
            new DefinePlugin({
                __node_env__: JSON.stringify(process.env.NODE_ENV ?? 'production'),
                __base_name__: JSON.stringify(process.env.BASE_NAME ?? ''),
                __sub_path__: JSON.stringify(process.env.SUB_PATH ?? ''),
            }),
        ])
    } as WebpackOptionsNormalized;
};

const getBuildTimeStr = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const mon = (date.getMonth() + 1).toString().padStart(2, '0');
    const timeStr = `${year}${mon}`;
    return timeStr;
};