# ArchwayBC Marking System

This is a project for AWS ISA interview (Scenario ArchwayBC railway company).

## Getting Started

### Prerequisite

Firstly, you need to have the following configured locally

- AWS CLI: https://aws.amazon.com/cli/
- Amplify CLI: https://docs.amplify.aws/cli/
- node: https://nodejs.org/en/

### Start an amplify project

```bash
mkdir archwaybc

cd archwaybc

# Initiate the project with this amplify fullstack repository
amplify init --app <https://github.com/LD8/archwaybc.git>

# Answer 'yes' to the question:
Initialize the project with the above configuration? yes

# Update the cloud resources
amplify push
```

**When the update is done, you can now see the project and related resources created on AWS Amplify Console.**

If any error occurs during the process, please refer to the [Amplify CLI Documentation](https://docs.amplify.aws/cli/) for more information.

## Local Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) with TypeScript enabled.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
