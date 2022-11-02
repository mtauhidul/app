const fs = require("fs");

const APP_NAME = process.env.APP_NAME;
const BUILD_ENV = process.env.BUILD_ENV;
const packageJSON = JSON.parse(fs.readFileSync("./package.json").toString());
const ports = JSON.parse(fs.readFileSync("./ports.json"));
const DOCKER_REPO = process.env.DOCKER_REPO || "888922156537.dkr.ecr.us-west-2.amazonaws.com";
const repositoryCredentials = process.env.repositoryCredentials;

const generator = () => {
    const version = packageJSON.version;
    const isProduction = BUILD_ENV === "production";
    const appSplit = APP_NAME.split("-")
    const clientId = appSplit[0];
    const appId = appSplit.slice(1).join("-");

    // Remove -released from image name
    const image = `${clientId}-${appId}:${version}`.replace("-released", "");

    const definitions = [{
        name: `${APP_NAME}-${BUILD_ENV.substring(0, 3)}`,
        image: `${DOCKER_REPO}/${image}`,
        cpu: 256,
        portMappings: [{
            containerPort: ports.in,
            hostPort: ports.out,
            protocol: "tcp"
        }],
        memory: 512,
        essential: true,
        environment: [
            {
                name: "BUILD_ENV",
                value: process.env.BUILD_ENV
            },
            {
                name: "NODE_ENV",
                value: process.env.NODE_ENV
            },
            {
                name: "AUTO_LOGOUT_MINS",
                value: process.env.AUTO_LOGOUT_MINS,
            },
            {
                name: "ZipkinURL",
                value: process.env.ZipkinURL,
            },
            {
                name: "interopioLoggingURL",
                value: process.env.interopioLoggingURL,
            },
            {
                name: "consoleLogLevel",
                value: process.env.consoleLogLevel,
            },
            {
                name: "ioLogLevel",
                value: process.env.ioLogLevel,
            },
            {
                name: "CLIENT_ID",
                value: process.env.CLIENT_ID,
            },
            {
                name: "CLIENT_SECRET",
                value: process.env.CLIENT_SECRET,
            },
            {
                name: "CLIENT_LAUNCH_OVERRIDES",
                value: process.env.CLIENT_LAUNCH_OVERRIDES,
            },
            {
                name: "SCOPE",
                value: process.env.SCOPE,
            },
            {
                name: "SESSION_SECRET",
                value: process.env.SESSION_SECRET,
            },
            {
                name: "DATA_STORE_URL",
                value: process.env.DATA_STORE_URL,
            },
            {
                name: "ALLOWED_IO_ACCOUNTS",
                value: process.env.ALLOWED_IO_ACCOUNTS,
            },
            {
                name: "ALLOWED_TOKEN_ISS",
                value: process.env.ALLOWED_TOKEN_ISS,
            },
            {
                name: "UPDATE_CRON_CONFIG",
                value: process.env.UPDATE_CRON_CONFIG,
            },
            {
                name: "REDIS_URL",
                value: process.env.REDIS_URL
            },
            {
                name: "REDIS_CLUSTER_URL",
                value: process.env.REDIS_CLUSTER_URL,
            },
            {
                name: "REDIS_CLUSTER_PORT",
                value: process.env.REDIS_CLUSTER_PORT,
            },
            {
                name: "STORAGE_TYPE",
                value: process.env.STORAGE_TYPE,
            },
            {
                name: "QUADRANT_API_URL",
                value: process.env.QUADRANT_API_URL,
            },
            {
                name: "QUADRANT_API_TOKEN_URL",
                value: process.env.QUADRANT_API_TOKEN_URL,
            },
            {
                name: "QUADRANT_API_CLIENT_ID",
                value: process.env.QUADRANT_API_CLIENT_ID,
            },
            {
                name: "QUADRANT_API_CLIENT_SECRET",
                value: process.env.QUADRANT_API_CLIENT_SECRET,
            },
            {
                name: "QUADRANT_API_AUDIENCE",
                value: process.env.QUADRANT_API_AUDIENCE,
            },
        ],
    }];

    if (repositoryCredentials) {
        definitions[0].repositoryCredentials = { credentialsParameter: repositoryCredentials }
    }

    definitions[0].logConfiguration = {
        logDriver: "awslogs",
        options: {
            "awslogs-group": `/ecs/${APP_NAME}-td-${BUILD_ENV.substring(0, 3)}`,
            "awslogs-region": isProduction ? "us-east-2" : "us-west-2",
            "awslogs-stream-prefix": "ecs"
        }
    };

    fs.writeFileSync(
        "container-definitions.json",
        JSON.stringify(definitions, null, 4),
        "utf8"
    );
};

generator();
