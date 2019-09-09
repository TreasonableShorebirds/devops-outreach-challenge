pipeline {
  agent none
  stages {
    /// [build]
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

    /// [prod]
    stage("Deploy to Production") {
      agent {
        label "lead-toolchain-skaffold"
      }
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
