module.exports = {
    "parserOptions": {
        "project": ["tsconfig.json"],
        "createDefaultProgram": true
    },
    "plugins": [
        "eslint-plugin-import",
        "eslint-plugin-prefer-arrow"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    "rules": {
        "no-constant-condition": "off",
        "prefer-const": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": ["error", {
            "allowSingleExtends": true
        }],
      "@typescript-eslint/no-namespace": "off", // 默认开启要求使用module代替namespace，和prefer-namespace-keyword冲突，关闭
      "@typescript-eslint/no-unused-vars": "off", // 关闭无用变量警告，自行编写的.d.ts文件会出现太多警告，变量未使用编辑器浅色提示
        "@typescript-eslint/no-floating-promises": ["error", {
        "ignoreVoid": true, // void后可以跟promise
        "ignoreIIFE": true // iife函数可以返回promise
        }],
        "@typescript-eslint/no-misused-promises": ["error", {
            "checksConditionals": true,
            "checksVoidReturn": false // 默认为true，常见订阅函数使用async方便内部异步调用
        }],
      "@typescript-eslint/no-unsafe-argument": "off", // 允许any作为函数参数
      "@typescript-eslint/no-unsafe-assignment": "off", // 允许any赋值至其他变量
      "@typescript-eslint/no-unsafe-call": "off", // 允许调用any类型的方法
      "@typescript-eslint/no-unsafe-member-access": "off", // 允许访问any类型的属性
      "@typescript-eslint/no-unsafe-return": "off", // 允许返回any类型
      "@typescript-eslint/restrict-template-expressions": ["error", { // 模板插值允许类型
        "allowNumber": true,
        "allowBoolean": true,
        "allowAny": true,
        "allowNullish": true
        }],
      "@typescript-eslint/unbound-method": "off", // 绑定回调时无需bind this
      "no-restricted-imports": ["error", {"paths": [{ // 默认
        "name": "rxjs/Rx",
        "message": "Please import directly from 'rxjs' instead"
      }, { // 新增lodash相关，不能直接使用，必须使用子文件
        "name": "lodash-es",
        "message": "Please import corresponding submodule instead"
    }]}],
      "@typescript-eslint/no-inferrable-types": "off", // 默认允许函数参数带有类型，此处完整关闭
      "@typescript-eslint/member-ordering": "off", // 自行设定顺序
      "max-len": ["warn", {"code": 200}], // 默认长度140，放大
        "@typescript-eslint/consistent-type-assertions": "error",
      "dot-notation": "off", // 使用.而非[]访问属性
      "@typescript-eslint/dot-notation": "off", // 允许使用['aa']访问字段
      "@typescript-eslint/naming-convention": ["error", { // 默认变量命名为camelCase，增加PascalCase
        "selector": "variable",
        "format": ["camelCase", "PascalCase"],
        "leadingUnderscore": "allow" // 允许头部带下划线
    }],
      // "@typescript-eslint/no-parameter-properties": "off", // 默认即关闭
      "no-unused-expressions": "off", // 避免无效表达式
      "@typescript-eslint/no-unused-expressions": ["error"],
      "@typescript-eslint/no-use-before-define": "off", // 默认即关闭
      "@typescript-eslint/prefer-for-of": "error", // 优先使用for-of
      "@typescript-eslint/prefer-function-type": "error", // 优先使用函数类型，避免使用interface A { (): string }
      "eqeqeq": ["error", "smart"], // 限定比较使用===
      "guard-for-in": "error", // for-in必须额外guard
      "id-blacklist": [ // 变量名、函数名、对象属性黑名单
        "error",
        "any",
        "Number", "number",
        "String", "string",
        "Boolean", "boolean",
        "Undefined", "undefined"
    ],
      "import/no-deprecated": "warn", // deprecated时警告
      "no-bitwise": "error", // 禁止位运算
      "no-console": ["error", {"allow": [ // 限制console的使用
        "log", "warn", "dir", "timeLog", "assert",
        "clear", "count", "countReset", "group", "groupEnd",
        "table", "dirxml", "error", "groupCollapsed", "Console",
        "profile", "profileEnd", "timeStamp", "context"
    ]}],
      "no-eval": "error", // 不允许使用eval
      "no-invalid-this": "off", // 特定场合允许使用this
      "no-new-wrappers": "error", // 不允许new String('')这样的写法
      "no-undef-init": "error", // 避免初始化为undefined
      "prefer-arrow/prefer-arrow-functions": ["error", { // 调整参数
        "allowStandaloneDeclarations": true // 允许top-level函数
      }], // 要求使用箭头函数
      "radix": "error", // parseInt时要求指定数制，避免其自动检测
      "arrow-body-style": "error", // 限定什么时候允许使用箭头函数形态
      "new-parens": "error", // new A时必须带有()
      "no-trailing-spaces": ["error", { // 避免尾部空白
        "ignoreComments": true // 允许comment中有空白
    }],
    "space-before-function-paren": ["error", {
        "anonymous": "never", // 无名函数参数紧贴function
        "named": "never", // 命名函数参数紧贴函数名
        "asyncArrow": "always" // async箭头函数参数之前有空格
    }],
      "@typescript-eslint/member-delimiter-style": ["error", { // 使用逗号分离interface成员
        "multiline": {
            "delimiter": "comma",
            "requireLast": true
        },
        "singleline": {
            "delimiter": "comma",
            "requireLast": false
        }
        }],
      "quotes": "off", // 仅使用单引号，且允许`xxx`字符串
        "@typescript-eslint/quotes": ["error", "single", {
        "allowTemplateLiterals": true
        }],
      "semi": "off", // 要求以;结尾
        "@typescript-eslint/semi": ["error", "always", {
        "omitLastInOneLineBlock": true // 单行block允许不带
        }],
      "@typescript-eslint/type-annotation-spacing": "error", // 类型注释要求空格
      // 新增
        "no-restricted-syntax": ["error",
        // "FunctionExpression", // 避免let a = function() {}，会影响class中的方法
        "WithStatement", // 避免with
        "BinaryExpression[operator='in']", // 避免foo in bar
        { // 使用@angular-eslint/recommended中设定
            "selector": "CallExpression[callee.object.name=\"console\"][callee.property.name=/^(debug|info|time|timeEnd|trace)$/]",
            "message": "Unexpected property on console object was called"
        }
        ],
      "no-duplicate-imports": "warn",  // 禁止import重复的模块
        "no-return-await": "error",
      "@typescript-eslint/prefer-literal-enum-member": "error" // 所有的enum声明都必须带有数字
    }
}