/**
 * Describes `fsn-project.json` files.
 * @public
 */
export declare interface FsnPackageConfig {
    /**
     * The path to the `fsn-package.schema.json` file.
     * @optional
     */
    $schema?: string;
    /**
     * Relative path to the project's `tsconfig.json`.
     * @default tsconfig.json
     * @optional
     */
    tsconfig: string;
    /**
     * Delete output path before build.
     * @default true
     * @optional
     */
    deleteDestPath: boolean;
    /**
     * Enable this to keep the 'scripts' section in `package.json`. Read the NPM Blog on
     * [Package install scripts vulnerability](http://blog.npmjs.org/post/141702881055/package-install-scripts-vulnerability).
     * @default true
     * @optional
     */
    keepLifecycleScripts: boolean;
    /**
     * For Typescript projects, enable this to copy README.md to the output directory specified in your `tsconfig.json`.
     * @default true
     * @optional
     */
    copyReadme: boolean;
    /**
     * A list of files or directory that are copied into the output directory.
     * @default []
     * @optional
     */
    assets: string[];
    /**
     * Description of the library's entry point.
     * @default {}
     * @optional
     */
    localDependencies: Record<DependencyName, LocalDependency>;
    /**
     * Define the local dependencies that should be inserted into the `dependencies`
     * section of your package manifest.
     * @default {}
     * @optional
     */
    lib: FsnProjectLib;
}

/**
 * Defines the regular expression that satisfies npm-compatible
 * package names.
 */
export declare type DependencyName =
    | '^(?:@[a-zA-Z0-9._-]+/)?[a-zA-Z0-9._-]+$'
    | string;

/**
 * Describes local dependencies.
 *
 * @interface
 * @public
 */
export declare interface LocalDependency {
    /**
     * The path to the local dependency's root directory
     * (i.e. the location of its `package.json` file) relative to this file.
     */
    rootDir: string;
    /**
     * Specify a version number to include in this project's package manifest.
     * @default "@latest"
     */
    version: string;
}

/**
 * Describes the library's entry point.
 *
 * @interface
 * @public
 */
export declare interface FsnProjectLib {
    /**
     * The name of the entry .ts or .js file.
     * @default public_api.ts
     */
    entryFile: string;
    /**
     * For libraries with a CLI, the name of the bin .ts or .js file.
     * @default "bin.ts"
     * @optional
     */
    bin?: string;
}
