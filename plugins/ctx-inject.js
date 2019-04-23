/* eslint-disable no-param-reassign  */
export default ({ app }) => {
  // Set the function directly on the context.app object
  app.myInjectedFunction = string => console.log('Okay, another function', string);
};
