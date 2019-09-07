pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        label "lead-toolchain-skaffold"
      }
      steps {
        container('skaffold') {
          sh "skaffold build --file-output=image.json"
          stash includes: 'image.json', name: 'build'
          sh "rm image.json"
        }
      }
    }
    /// [build]

    /// [gate]
    stage ('Manual Ready Check') {
      agent none
///      when {
///        branch 'master'
///      }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      input {
        message 'Deploy to Production?'
      }
      steps {
        echo "Deploying"
      }
    }
    /// [gate]

    /// [prod]
    stage("Deploy to Production") {
      agent {
        label "lead-toolchain-skaffold"
      }
///      when {
///          branch 'master'
///      }
      environment {
        TILLER_NAMESPACE = "toolchain"
        REACT_APP_IP = "apprentice-outreach.prod.liatr.io"
      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${TILLER_NAMESPACE}"
        }
      }
    }
    /// [prod]
  }
}
