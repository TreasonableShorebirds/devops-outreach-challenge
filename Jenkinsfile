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

    stage("Deploy to Staging") {
      agent {
        label "lead-toolchain-skaffold"
      }
      when {
          branch 'master'
      }
      environment {
        TILLER_NAMESPACE = "${env.stagingNamespace}"
        ISTIO_DOMAIN     = "${env.stagingDomain}"
        API_URL          = "https://apprentice-outreach.${env.stagingDomain}/api"

      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${TILLER_NAMESPACE}"
        }
        stageMessage "Successfully deployed to staging:\napprentice-outreach.${env.stagingDomain}"
      }
    }

    stage ('Manual Ready Check') {
      agent none
      when {
        branch 'master'
      }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        input message: 'Finished using the web site? (Click "Proceed" to continue)'
      }
    }

    stage("Deploy to Production") {
      agent {
        label "lead-toolchain-skaffold"
      }
      when {
          branch 'master'
      }
      environment {
        TILLER_NAMESPACE = "${env.productionNamespace}"
        ISTIO_DOMAIN     = "${env.productionDomain}"
        API_URL          = "https://apprentice-outreach.${env.productionDomain}/api"
      }
      steps {
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${TILLER_NAMESPACE}"
        }
        stageMessage "Successfully deployed to production:\napprentice-outreach.${env.productionNamespace}/"
      }
    }
  }
}
