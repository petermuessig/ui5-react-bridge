import { graphFromPackageDependencies } from '@ui5/project/graph';
import {createReaderCollection} from "@ui5/fs/resourceFactory";

import { getLogger } from "@ui5/logger";
const log = getLogger("vite-ui5");

export default function viteUI5(opts = {}) {
    return {
        name: 'vitejs-plugin-ui5',
        async configureServer(server) {
            try {
                const graph = await graphFromPackageDependencies({
                    //cwd: options.basePath,
                    //rootConfigPath: determineConfigPath(configPath, configFile),
                    workspaceName: process.env["ui5-workspace"] || "default",
                    //workspaceConfigPath: determineConfigPath(workspaceConfigPath, workspaceConfigFile),
                    //versionOverride: options.versionOverride,
                    //cacheMode: options.cacheMode,
                });

                const rootProject = graph.getRoot();

                const readers = [];
                await graph.traverseBreadthFirst(async function ({ project: dep }) {
                    if (dep.getName() === rootProject.getName()) {
                        // Ignore root project
                        return;
                    }
                    readers.push(dep.getReader({ style: "runtime" }));
                });

                const dependencies = createReaderCollection({
                    name: `Dependency reader collection for project ${rootProject.getName()}`,
                    readers,
                });

                const rootReader = rootProject.getReader({ style: "runtime" });

                // TODO change to ReaderCollection once duplicates are sorted out
                const combo = createReaderCollection({
                    name: "server - prioritize workspace over dependencies",
                    readers: [rootReader, dependencies],
                });
                const resources = {
                    rootProject: rootReader,
                    dependencies: dependencies,
                    all: combo,
                };

                server.middlewares.use(async (req, res, next) => {
                    if (req.url === '/resources/sap-ui-core.js') {
                        const ui5Module = dependencies && await dependencies.byPath(req.url);
                        let content = await ui5Module?.getString();
                        // loop over all occurrences of the raw or require syntax and create a new file out of the content
                        const matches = content?.matchAll(/\"(raw|require):(.+)\"/g);
                        if (matches) {
                            const newContent = [];
                            for (const [, type, moduleName] of matches) {
                                if (type === 'raw') {
                                    newContent.push(new Promise(async (resolve, reject) => {
                                        // For raw, we need to load the module as a string
                                        const ui5Module = dependencies && await dependencies.byPath(`/resources/${moduleName}${moduleName.endsWith(".js") ? "" : ".js"}`);
                                        const content = await ui5Module?.getString() || "ERROR: Module not found!";
                                        resolve(content);
                                    }));
                                } else if (type === 'require') {
                                    // For require, we need to load the module as a module
                                    newContent.push(Promise.resolve(`sap.ui.requireSync("${moduleName}");`));
                                    if (moduleName === "sap/ui/core/Core") {
                                        newContent.push(Promise.resolve(`sap.ui.getCore().boot && sap.ui.getCore().boot();`));
                                    }
                                }
                            }
                            content = await Promise.all(newContent);
                            content = content.join('\n');
                        }
                        res.setHeader('Content-Type', 'application/javascript');
                        res.setHeader('Cache-Control', 'no-cache');                            
                        return res.end(content);
                    }
                    next();
                });

                // TODO: rework ui5-server API and make public
                const { default: MiddlewareManager } = await import("@ui5/server/internal/MiddlewareManager");
                const middlewareManager = new MiddlewareManager({
                    graph,
                    rootProject,
                    resources,
                    options: {
                        //sendSAPTargetCSP,
                        //serveCSPReports,
                        //simpleIndex: true
                    },
                });
                // apply the middleware but filter the unnamed middlewares related for the serve index
                await middlewareManager.applyMiddleware({
                    use: (mountPath, middleware) => {
                        if (middleware.name) {
                            //console.log(`Mounting middleware ${middleware.name} at ${mountPath}`);
                            server.middlewares.use(mountPath, middleware);
                        }
                    }
                });                        
            } catch (e) {
                log.error("Error while creating dependency graph", e);
            }

        },
    };
};
