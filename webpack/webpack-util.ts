import path from 'path';
import {Configuration, IgnorePlugin, RuleSetRule} from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

// 生成项目所需配置文件
export function generateConfiguration(
    mode: 'dev' | 'prod', // 模式
    input: { // 输入
        dir: string, // 基本路径
        html?: string, // 页面入口，允许没有
        // ts和scss至少存在一个，否则也不需要webpack打包
        ts?: string, // ts入口，允许为空，表示没有ts
        scss?: string, // scss入口，允许为空，表示没有scss
    },
    output: { // 输出
        dir: string, // 基本路径
        html?: string, // 页面，默认为index.html
        js?: string, // js，默认为dist/main.js
        css?: string, // css，默认为dist/main.css
    },
    options: {
        rules?: Array<RuleSetRule>, // 额外添加的rule
        forceES5?: boolean, // 项目ts、引用js转码为es5
    } = {},
): Configuration { // 返回
    // 修正为绝对路径
    input.dir = path.resolve(input.dir);
    output.dir = path.resolve(output.dir);

    // 设定输出默认值，这样后续就不用判断其是否存在
    if (output.html == null) {
        output.html = input.html;
    }
    if (output.js == null) {
        output.js = 'dist/main.js';
    }
    if (output.css == null) {
        output.css = 'dist/main.css';
    }

    return {
        // 注意：若使用context指定输入路径，entry必须以./开头，暂不使用；而是每个输入项指定绝对路径
        // context: input.dir,

        // 指定入口，注意：数组传入时，文件在同一bundle中，bundle-name为main
        entry: [
            // 存在ts入口且强制es5转码时async/await要求使用regenerator-runtime，core-js提供标准库polyfill
            ...(input.ts != null && options.forceES5 ? ['regenerator-runtime', 'core-js'] : []),
            // 特别注意：polyfills必须在ts之前，确保ts运行时已完成polyfills
            ...(input.ts != null ? [path.join(input.dir, input.ts)] : []),
            ...(input.scss != null ? [path.join(input.dir, input.scss)] : []),
        ],

        // 设定输出，注意：后续MiniCssExtractPlugin、CopyPlugin都会使用path作为基准
        output: {
            path: output.dir,
            filename: output.js,

            // webpack5开始，rule中可指定type，输出文件名默认为[hash][ext][query]，此处和css在同一目录下
            assetModuleFilename: path.dirname(output.css) + '/[name]-[hash][ext][query]',
        },

        // module解析
        resolve: {
            modules: [path.resolve('node_modules')],
            extensions: ['.ts', '.tsx', '.js'], // 引用时自动添加并检查的扩展名
            /**
             * 情况：
             * 1、webpack默认按照['browser', 'module', 'main']的顺序从package.json中选择引入文件
             * 2、swiper没有browser字段，将落在module，而swiper的module含有es6代码（华为浏览器不支持）
             * 方案：
             *  使用alias，将swiper直接定位在main字段指定的文件上：会引起swiper在打包的时候丢失，原因未知
             *  调整mainFields属性，main在module前：这会对所有引用内容生效，影响tree-shake
             *  打包后通过babel，将es6转码为es5：目前采用的方法
             * dom7也有同样的问题
             */
            // alias: {
            //     swiper$: 'swiper/dist/js/swiper.js ', // 必须是精准匹配，否则scss中swiper会受影响
            // },
            // mainFields: ['browser', 'main', 'module'],
            // 参考：https://github.com/justadudewhohacks/face-api.js/issues/154
            fallback: { // 避免对fs的引用
                fs: false,
            },
        },

        // module载入
        module: {
            rules: [{ // ts文件使用ts-loader
                test: /\.tsx?$/,
                // test: /\.ts$/,
                use: [{
                    loader: 'ts-loader',
                    options: { // force-es5时覆盖target为es5
                        ...options.forceES5 ? {
                            compilerOptions: {
                                target: 'es5',
                            },
                        } : {},
                    },
                }],
            },
            ...options.forceES5 ? [{ // force-es5时js通过babel做转码
                test: /\.js$/,
                // 注意：此处没有使用exclude: /node_modules/，确保引用都被转码
                use: [{
                    loader: 'babel-loader',
                    options: {presets: ['@babel/preset-env']},
                }],
            }]: [],
            { // scss转码后保存为独立文件，注意：适用css
                test: /\.scss$|\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // css至文件
                    { // 处理css中@import和url()
                        // 参考@angular-devkit/build-angular依赖
                        loader: 'css-loader',
                        // 确保css中url()被解析，通过file-loader保存
                        // 特别注意：url以output为input为相对路径的起点
                        options: {url: true},
                    }, { // scss -> css
                        // 参考@angular-devkit/build-angular依赖版本
                        loader: 'sass-loader',
                        options: {
                            /**
                             * 压缩形式输出
                             * 参考：https://web-design-weekly.com/2014/06/15/different-sass-output-styles/
                             * 注意：dart-sass仅支持expanded和compressed
                             */
                            sassOptions: {outputStyle: mode === 'prod' ? 'compressed' : 'expanded'},
                            // 使用dart-sass实现，参考@angular-devkit/build-angular安装
                            implementation: require('sass'),
                        },
                    },
                ],
            }, { // 图片和字体资源保存在css相同的目录
                test: /\.(png|jpe?g|gif|svg|ttf)$/,
                type: 'asset/resource',
            }, { // svg内联载入为字符串
                test: /\.svg/,
                type: 'asset/inline',
            }, ...options.rules ?? []], // 添加额外rule
        },

        /**
         * 模式设定
         * 1、默认为production，命令行添加--mode=production强制调整
         * 2、此处修改为根据外部mode调整；此处也可以直接写成development，但不够清晰
         */
        mode: mode === 'prod' ? 'production' : 'development',
        // mode: 'development',

        /**
         * source-map设定，prod模式下不使用source-map，注意：
         * 1、devtool不会自动根据mode变化，需要手工调整
         * 1、需要在tsconfig中设定sourceMap: true以及此处设定devtool: 'source-map'，才能在浏览器中看到ts源码
         * 3、设定前者、未设定后者，只能看到整体js文件；未设定前者、设定后者，能看到整体js文件和单个ts文件，但ts文件为转码结果
         */
        devtool: mode === 'prod' ? false : 'source-map',

        // dev-server设定
        // devServer: {contentBase: './dist'},

        // 默认超过200多K就会报警，提高阈值
        performance: {
            maxEntrypointSize: 3 * 1024 * 1024,
            maxAssetSize: 2 * 1024 * 1024,
        },

        optimization: {
            minimizer: [new TerserPlugin({
                extractComments: false, // 不会生成licence
            }), new CssMinimizerPlugin()],
            /**
             * named: 使用目录+文件名命名，development时默认值
             * natural: 使用顺序数字
             * deterministic: 确定数字，production时默认值
             * 无论如何设定都不能使用传统注释形式指定名称
             */
            /* webpackChunkName: "tiny-detector-model" */
            // chunkIds: 'natural',
        },

        plugins: [
            new MiniCssExtractPlugin({ // css剥离
                filename: output.css, // 在output.path下生成
            }),
            ...input.html != null ? [new CopyPlugin({ // html复制
                patterns: [{ // html复制到输出目录下
                    from: path.join(input.dir, input.html),
                    to: output.html, // 在output.path下生成
                }],
            })] : [],
            new IgnorePlugin({ // 忽略无用的moment locales，chart.js中引入了moment
                contextRegExp: /moment$/,
                resourceRegExp: /^\.\/locale$/,
            }),
        ],
    };
}