library 'LEAD'
pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        label "lead-toolchain-skaffold"
      }
      steps {
        notifyPipelineStart()
        notifyStageStart()
        container('skaffold') {
          sh "skaffold build --file-output=image.json"
          stash includes: 'image.json', name: 'build'
          sh "rm image.json"
        }
      }
      post {
        success {
          notifyStageEnd()
        }
        failure {
          notifyStageEnd([result: "fail"])
        }
      }
    }

    stage("Deploy to Staging") {
      agent {
        label "lead-toolchain-skaffold"
      }
      when {
          branch 'ENG-909'
      }
      environment {
        TILLER_NAMESPACE = "${env.stagingNamespace}"
        ISTIO_DOMAIN     = "${env.stagingDomain}"
        REACT_APP_IP     = "apprentice-outreach.${env.stagingDomain}"

      }
      steps {
        notifyStageStart()
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${TILLER_NAMESPACE}"
        }
      }
      post {
        success {
          notifyStageEnd([status: "Successfully deployed to staging:\napprentice-outreach.${env.stagingDomain}"])
        }
        failure {
          notifyStageEnd([result: "fail"])
        }
      }
    }

    stage ('Manual Ready Check') {
      agent none
      when {
        branch 'ENG-909'
      }
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

    stage("Deploy to Production") {
      agent {
        label "lead-toolchain-skaffold"
      }
      when {
          branch 'ENG-909'
      }
      environment {
        TILLER_NAMESPACE = "${env.productionNamespace}"
        ISTIO_DOMAIN   = "${env.productionDomain}"
        REACT_APP_IP     = "apprentice-outreach.${env.productionDomain}"
      }
      steps {
        notifyStageStart()
        container('skaffold') {
          unstash 'build'
          sh "skaffold deploy -a image.json -n ${TILLER_NAMESPACE}"
        }
      }
      post {
        success {
          notifyStageEnd([status: "Successfully deployed to production:\napprentice-outreach.${env.productionNamespace}/"])
        }
        failure {
          notifyStageEnd([result: "fail"])
        }
      }
    }
  }
  post {
    success {
      echo "Pipeline Success"
      notifyPipelineEnd()
    }
    failure {
      echo "Pipeline Fail"
      notifyPipelineEnd([result: "fail"])
    }
  }
}
