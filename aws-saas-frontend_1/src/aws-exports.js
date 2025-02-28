const awsConfig = {
    Auth: {
        region: 'us-west-1',
        userPoolId: 'us-west-1_mJ0nwfHd2',
        userPoolWebClientId: '5132d0n28h947jm6gv4t06n2vl',
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        oauth: undefined, // Explicitly remove OAuth
    },
    Storage: {
        AWSS3: {
            bucket: import.meta.env.VITE_S3_BUCKET_NAME,
            region: import.meta.env.VITE_COGNITO_REGION,
        },
    },
};

export default awsConfig;
