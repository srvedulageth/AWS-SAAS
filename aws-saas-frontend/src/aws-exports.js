const awsExports = {
    Auth: {
	Cognito: {
          userPoolId: 'us-west-1_mJ0nwfHd2',
          userPoolClientId: '7d4pcs5p1fflvd90bbjbpb79t2',
          loginWith: {
	     oauth: {
                domain: 'us-west-1mj0nwfhd2.auth.us-west-1.amazoncognito.com',
                scopes: ['openid','email','phone','profile','aws.cognito.signin.user.admin'],
                redirectSignIn: ['https://example.com/'],
                redirectSignOut: ['https://example.com/'],
                responseType: 'code',
	     }
	  },  // ✅ Ensure loginWith exists
	},
        region: 'us-west-1',
        authenticationFlowType: 'USER_PASSWORD_AUTH',
        oauth: {
            domain: '',
            scope: [],
            redirectSignIn: '',
            redirectSignOut: '',
            responseType: ''
        }
    },
    Storage: {
	S3: {
            bucket: import.meta.env.VITE_S3_BUCKET_NAME,
            region: import.meta.env.VITE_COGNITO_REGION,
	}
    },
};

export default awsExports;
