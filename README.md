# ui5-react-bridge

This project showcases the combination of React and OpenUI5. It integrates the UI5 dev server into the Vite dev server, ensures to bootstrap OpenUI5 using a `SCRIPT` tag and integrate a UI5 XMLView into a React component by mapping the state into a JSON model to make it available for databinding for UI5 controls.

## Available Scripts

In the project directory, you can run:

### `npm serve`

Runs the app in the development mode and opens the browser.<br />

The page will reload if you make edits.<br />

### `npm build`

Builds the app for production to the `build` folder.<br />

> *REMARK*: The build is not implemented. It would require to also build the OpenUI5 runtime with the UI5 CLI which is missing for now.<br />

### `npm start`

Starts the production build for the app from the `build` folder.<br />

> *REMARK*: This isn't working yet as the build doesn't include the OpenUI5 runtime.
