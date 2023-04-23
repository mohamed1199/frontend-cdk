pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION ='us-east-1'
        PROJECT_NAME = 'frontend-cdk'
    }

    stages {
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install aws-cdk-lib'
            }
        }

        stage('Bootstrap') {
            steps {
                sh 'cdk bootstrap'
            }
        }

        stage('Deploy') {
            steps {
                withAWS(credentials: 'aws-access-key-id', region: 'us-east-1') {
                    sh 'cdk deploy --require-approval=never'
                }
            }
        }
    }
}
