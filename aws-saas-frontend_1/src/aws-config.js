import { Amplify } from "aws-amplify";
import awsConfig from './aws-exports';

console.log(awsConfig);
Amplify.configure(awsConfig);

export default Amplify;
