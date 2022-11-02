Technical Documentation
===========================================

1. __Overview__ - ...:
    - Common Technologies:
        ------------------
        - Source control - __git__ (BitBucket)
        - Delivery containers - __Docker__
        - Delivery method - __BitBucket Pipelines__
        - Proxy Manager- __nginx__
        - Script runner - __NPM__
    - Frontend Application:
        -------------------
        - __Core Technologies:__
            - Framework - __React__
            - Global State management - __Redux__
            - Core Visual Style - __Material UI__
            - Core Language - __EcmaScript 2021__
            - Transpiler - __Babel__
            - Transpile framework - __Webpack__
            - Custom Styles - __LESS__
            - Test Frameworks - __Mocha__ + __Chai__
            - Coverage Framework - __NYC__
            - Communications - __Fetch__ + __FHIRClient.js__
            - FHIR Client - __FHIRClient.js__
            - Authorization - handled by FHIR servers

3. Manual Installation Instructions
    - Frontend:
        - Install node_modules
        ```
        npm run install
        ```
        - Run code coverage report generation
        ```
        npm run coverage
        ```
        - Run build process, where BUILD_ENV and NODE_ENV should be set to production (or another environment, depending on deployment needs)
        ```
        appInfo=$appInfo ZipkinURL=$ZipkinURL interopioLoggingURL=$interopioLoggingURL BUILD_ENV=$BUILD_ENV NODE_ENV=$NODE_ENV npm run frontend:build:custom
        ```
        - Statically serve the contents of the ```frontend/build/www``` folder with your favorite webserver. Make sure that the App paths are redirected back to the index.html of the applications.
