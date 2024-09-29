/**
 * Describes `fsn-project.json` files.
 *
 * @prop {string} tsconfig Relative path to the project's `tsconfig.json`.
 * @prop {boolean} deleteDestPath Delete output path before build.
 * @prop {boolean} keepLifecycleScripts Enable this to keep the 'scripts' section in package.json. Read the NPM Blog on [Package install scripts vulnerability](http://blog.npmjs.org/post/141702881055/package-install-scripts-vulnerability)
 * @prop {string[]} assets A list of files or directory that are copied into the output directory.
 *
 * @interface
 * @public
 */
export declare interface FsnProjectConfig {
    tsconfig: string;
    deleteDestPath: boolean;
    keepLifecycleScripts: boolean;
    assets: string[];
}
